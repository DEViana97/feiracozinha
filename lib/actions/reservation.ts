"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import {
  environmentSchema,
  reservationSchema,
  availabilityQuerySchema,
  type EnvironmentInput,
  type ReservationInput,
} from "@/lib/validations/reservation";
import {
  hasStarted,
  pickTable,
  reservationTimesFor,
} from "@/lib/reservation-availability";
import { contactKey, namesMatch } from "@/lib/contact-key";
import { areReservationsEnabled } from "@/lib/queries";
import { escapeHtml, sendTelegramMessage } from "@/lib/telegram";
import { sendWhatsappReservationConfirmation } from "@/lib/whatsapp";

function revalidateAll() {
  revalidatePath("/reservas");
  revalidatePath("/admin/reservations");
}

// ---------- Admin: ambientes ----------

export async function createEnvironment(input: EnvironmentInput) {
  await requireAuth();
  const data = environmentSchema.parse(input);
  const max = await prisma.environment.aggregate({ _max: { order: true } });

  await prisma.environment.create({
    data: {
      name: data.name,
      description: data.description || null,
      active: data.active,
      order: (max._max.order ?? -1) + 1,
      tableGroups: { create: data.tableGroups },
    },
  });
  revalidateAll();
}

export async function updateEnvironment(id: string, input: EnvironmentInput) {
  await requireAuth();
  const data = environmentSchema.parse(input);

  await prisma.$transaction([
    prisma.tableGroup.deleteMany({ where: { environmentId: id } }),
    prisma.environment.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        active: data.active,
        tableGroups: { create: data.tableGroups },
      },
    }),
  ]);
  revalidateAll();
}

export async function toggleEnvironmentActive(id: string, active: boolean) {
  await requireAuth();
  await prisma.environment.update({ where: { id }, data: { active } });
  revalidateAll();
}

export async function deleteEnvironment(id: string) {
  await requireAuth();
  // Cascade apaga também as reservas do ambiente.
  await prisma.environment.delete({ where: { id } });
  revalidateAll();
}

// ---------- Admin: reservas ----------

function formatDateBr(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

async function notifyCancellation(
  r: { name: string; contact: string; date: string; time: string; people: number; environment: { name: string } },
  by: string
) {
  await sendTelegramMessage(
    [
      "❌ <b>Reserva cancelada</b>",
      "",
      `<b>Nome:</b> ${escapeHtml(r.name)}`,
      `<b>Contato:</b> ${escapeHtml(r.contact)}`,
      `<b>Data:</b> ${formatDateBr(r.date)} às ${r.time}`,
      `<b>Pessoas:</b> ${r.people}`,
      `<b>Ambiente:</b> ${escapeHtml(r.environment.name)}`,
      `<i>Cancelada ${by}</i>`,
    ].join("\n")
  );
}

export async function cancelReservation(id: string) {
  await requireAuth();
  // updateMany + status evita avisar duas vezes se já estava cancelada.
  const { count } = await prisma.reservation.updateMany({
    where: { id, status: "CONFIRMED" },
    data: { status: "CANCELLED" },
  });
  if (count > 0) {
    const r = await prisma.reservation.findUnique({
      where: { id },
      include: { environment: { select: { name: true } } },
    });
    if (r) await notifyCancellation(r, "pelo painel");
  }
  revalidateAll();
}

export async function deleteReservation(id: string) {
  await requireAuth();
  await prisma.reservation.delete({ where: { id } });
  revalidateAll();
}

// ---------- Público (sem requireAuth de propósito) ----------

export type EnvironmentAvailability = {
  id: string;
  name: string;
  description: string | null;
  available: boolean;
};

// Lista os ambientes ativos e diz em quais ainda há mesa para (date, time, people).
export async function checkAvailability(input: {
  date: string;
  time: string;
  people: number;
}): Promise<EnvironmentAvailability[]> {
  if (!(await areReservationsEnabled())) return [];
  const q = availabilityQuerySchema.parse(input);

  const [environments, booked] = await Promise.all([
    prisma.environment.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: { tableGroups: true },
    }),
    prisma.reservation.findMany({
      where: { date: q.date, status: "CONFIRMED" },
      select: { environmentId: true, time: true, tableSeats: true },
    }),
  ]);

  return environments.map((env) => ({
    id: env.id,
    name: env.name,
    description: env.description,
    available:
      pickTable(
        env.tableGroups,
        booked.filter((b) => b.environmentId === env.id),
        q.time,
        q.people
      ) !== null,
  }));
}

export type PublicReservation = {
  name: string;
  date: string;
  time: string;
  people: number;
  environmentName: string;
  status: "CONFIRMED" | "CANCELLED";
  // Já começou: não dá mais para cancelar pelo link.
  locked: boolean;
};

export async function getReservationByToken(token: string): Promise<PublicReservation | null> {
  if (!(await areReservationsEnabled())) return null;
  if (!token || token.length > 100) return null;
  const r = await prisma.reservation.findUnique({
    where: { cancelToken: token },
    include: { environment: { select: { name: true } } },
  });
  if (!r) return null;
  return {
    name: r.name,
    date: r.date,
    time: r.time,
    people: r.people,
    environmentName: r.environment.name,
    status: r.status,
    locked: hasStarted(r.date, r.time),
  };
}

export async function cancelReservationByToken(
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await areReservationsEnabled())) {
    return { ok: false, error: "As reservas estão indisponíveis no momento." };
  }
  const r = await prisma.reservation.findUnique({
    where: { cancelToken: token },
    include: { environment: { select: { name: true } } },
  });
  if (!r) return { ok: false, error: "Reserva não encontrada." };
  if (r.status === "CANCELLED") return { ok: true };
  if (hasStarted(r.date, r.time)) {
    return { ok: false, error: "Essa reserva já começou e não pode mais ser cancelada." };
  }

  const { count } = await prisma.reservation.updateMany({
    where: { id: r.id, status: "CONFIRMED" },
    data: { status: "CANCELLED" },
  });
  if (count > 0) await notifyCancellation(r, "pelo cliente");

  revalidateAll();
  return { ok: true };
}

export type MyReservation = PublicReservation & { token: string };

// Acha as reservas de um cliente por telefone + nome. Exige os dois: o telefone
// filtra no banco (contactKey) e o nome confirma, para não listar reservas de
// quem só adivinhou um número.
export async function findMyReservations(input: {
  name: string;
  contact: string;
}): Promise<MyReservation[]> {
  if (!(await areReservationsEnabled())) return [];
  const name = String(input?.name ?? "").slice(0, 80);
  const key = contactKey(String(input?.contact ?? "").slice(0, 40));
  if (key.length < 10 || name.trim().length < 2) return [];

  const found = await prisma.reservation.findMany({
    where: { contactKey: key },
    include: { environment: { select: { name: true } } },
    orderBy: [{ date: "desc" }, { time: "desc" }],
    take: 50,
  });
  const rows = found.filter((r) => namesMatch(r.name, name));
  return rows.map((r) => ({
    token: r.cancelToken,
    name: r.name,
    date: r.date,
    time: r.time,
    people: r.people,
    environmentName: r.environment.name,
    status: r.status,
    locked: hasStarted(r.date, r.time),
  }));
}

export type CreateReservationResult =
  | { ok: true; summary: string; cancelToken: string }
  | { ok: false; error: string };

export async function createReservation(
  input: ReservationInput
): Promise<CreateReservationResult> {
  if (!(await areReservationsEnabled())) {
    return { ok: false, error: "As reservas estão indisponíveis no momento." };
  }
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const data = parsed.data;

  // Só dias e horários em que o restaurante recebe reservas, e que ainda não passaram.
  if (!reservationTimesFor(data.date).includes(data.time)) {
    return { ok: false, error: "Esse dia ou horário não está disponível para reservas." };
  }
  if (hasStarted(data.date, data.time)) {
    return { ok: false, error: "Esse horário já passou. Escolha outro." };
  }

  const result = await prisma
    .$transaction(
      async (tx) => {
        const env = await tx.environment.findFirst({
          where: { id: data.environmentId, active: true },
          include: { tableGroups: true },
        });
        if (!env) return { ok: false as const, error: "Ambiente indisponível." };

        const booked = await tx.reservation.findMany({
          where: { environmentId: env.id, date: data.date, status: "CONFIRMED" },
          select: { time: true, tableSeats: true },
        });
        const seats = pickTable(env.tableGroups, booked, data.time, data.people);
        if (seats === null) {
          return { ok: false as const, error: "Não há mais mesas disponíveis nesse horário." };
        }

        const created = await tx.reservation.create({
          data: {
            environmentId: env.id,
            date: data.date,
            time: data.time,
            people: data.people,
            tableSeats: seats,
            name: data.name,
            contact: data.contact,
            contactKey: contactKey(data.contact),
          },
        });
        return { ok: true as const, env, seats, cancelToken: created.cancelToken };
      },
      // Serializable evita duas pessoas pegarem a última mesa ao mesmo tempo.
      { isolationLevel: "Serializable" }
    )
    .catch((err) => {
      console.error("Falha ao criar reserva:", err);
      return {
        ok: false as const,
        error: "Não foi possível concluir a reserva. Tente novamente.",
      };
    });

  if (!result.ok) return { ok: false, error: result.error };

  const [y, m, d] = data.date.split("-");
  const dateBr = `${d}/${m}/${y}`;

  await sendTelegramMessage(
    [
      "🍽 <b>Nova reserva</b>",
      "",
      `<b>Nome:</b> ${escapeHtml(data.name)}`,
      `<b>Contato:</b> ${escapeHtml(data.contact)}`,
      `<b>Data:</b> ${dateBr} às ${data.time}`,
      `<b>Pessoas:</b> ${data.people}`,
      `<b>Ambiente:</b> ${escapeHtml(result.env.name)} (mesa de ${result.seats} lugares)`,
    ].join("\n")
  );

  // Confirmação ao cliente pelo WhatsApp (não lança; se falhar, a reserva continua valendo).
  await sendWhatsappReservationConfirmation({
    name: data.name,
    contact: data.contact,
    date: dateBr,
    time: data.time,
    people: data.people,
  });

  revalidateAll();
  return {
    ok: true,
    summary: `${data.name}, sua mesa para ${data.people} pessoa${
      data.people > 1 ? "s" : ""
    } no ambiente ${result.env.name} está confirmada em ${dateBr} às ${data.time}.`,
    cancelToken: result.cancelToken,
  };
}
