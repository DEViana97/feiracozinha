"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import {
  checkAvailability,
  createReservation,
  type EnvironmentAvailability,
} from "@/lib/actions/reservation";
import { saveContact, useSavedContact } from "@/lib/my-reservations";
import { isOpenDate, reservationTimesFor } from "@/lib/reservation-availability";

const MAX_PEOPLE = 20;
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const WEEK_HEAD = ["D", "S", "T", "Q", "Q", "S", "S"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function formatDateLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).toLocaleDateString("pt-BR", { weekday: "long" });
  return `${weekday}, ${pad(d)}/${pad(m)}/${y}`;
}

const field =
  "w-full rounded-md border border-iron-grey/30 bg-[#FFFDF9] px-3 py-[11px] font-sans text-sm text-[#3B2A26] outline-none focus:border-dark-wine focus:ring-1 focus:ring-dark-wine";

function Step({
  n,
  title,
  done,
  children,
}: {
  n: number;
  title: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-taupe/20 bg-[#FFFDF9] p-4">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span
          className={`flex size-6 items-center justify-center rounded-full font-sans text-[12px] font-semibold ${
            done ? "bg-dark-wine text-floral-white" : "border border-dark-wine/50 text-dark-wine"
          }`}
        >
          {done ? <Check className="size-3.5" /> : n}
        </span>
        <h2 className="m-0 font-sans text-xs font-semibold uppercase tracking-[1.5px] text-iron-grey">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function ReservationForm({
  today,
  nowTime,
  whatsappUrl,
}: {
  // "YYYY-MM-DD" e "HH:mm" no fuso do restaurante (o servidor entrega; o do navegador pode diferir).
  today: string;
  nowTime: string;
  whatsappUrl: string | null;
}) {
  const [ty, tm] = today.split("-").map(Number);
  const [view, setView] = useState({ y: ty, m: tm - 1 });
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [environmentId, setEnvironmentId] = useState<string | null>(null);
  const saved = useSavedContact();
  // null = ainda não digitou: mostra os dados salvos neste aparelho (reserva anterior).
  const [nameInput, setNameInput] = useState<string | null>(null);
  const [contactInput, setContactInput] = useState<string | null>(null);
  const name = nameInput ?? saved?.name ?? "";
  const contact = contactInput ?? saved?.contact ?? "";

  const [avail, setAvail] = useState<{ key: string; list: EnvironmentAvailability[] } | null>(
    null
  );
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState<{ summary: string; token: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const availKey = date && time ? `${date}|${time}|${people}` : null;
  const loadingEnv = !!availKey && avail?.key !== availKey;
  const environments = avail && avail.key === availKey ? avail.list : [];
  // Se o ambiente escolhido ficou sem mesa para a nova combinação, a escolha cai sozinha.
  const selectedEnv = environments.some((e) => e.id === environmentId && e.available)
    ? environmentId
    : null;

  useEffect(() => {
    if (!date || !time) return;
    const key = `${date}|${time}|${people}`;
    let cancelled = false;
    checkAvailability({ date, time, people })
      .then((list) => !cancelled && setAvail({ key, list }))
      .catch(() => !cancelled && setAvail({ key, list: [] }));
    return () => {
      cancelled = true;
    };
  }, [date, time, people]);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const days = new Date(view.y, view.m + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)] as (
      | number
      | null
    )[];
  }, [view]);

  const atCurrentMonth = view.y === ty && view.m === tm - 1;

  function shiftMonth(delta: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  const contactOk = contact.replace(/\D/g, "").length >= 10;
  const ready = !!date && !!time && !!selectedEnv && name.trim().length >= 2 && contactOk;

  const missing = !date
    ? "Escolha a data"
    : !time
      ? "Escolha o horário"
      : !selectedEnv
        ? "Escolha o ambiente"
        : name.trim().length < 2
          ? "Informe seu nome"
          : !contactOk
            ? "Informe seu WhatsApp"
            : isPending
              ? "Reservando..."
              : "Confirmar reserva";

  function submit() {
    if (!ready || !date || !time || !selectedEnv || isPending) return;
    setSubmitError("");
    startTransition(async () => {
      try {
        const result = await createReservation({
          environmentId: selectedEnv,
          date,
          time,
          people,
          name: name.trim(),
          contact: contact.trim(),
        });
        if (result.ok) {
          saveContact({ name: name.trim(), contact: contact.trim() });
          setDone({ summary: result.summary, token: result.cancelToken });
        } else {
          setSubmitError(result.error);
          // Pode ter perdido a última mesa: recarrega a disponibilidade.
          setAvail(null);
        }
      } catch {
        setSubmitError("Não foi possível concluir a reserva. Tente novamente.");
      }
    });
  }

  function reset() {
    setDate(null);
    setTime(null);
    setPeople(2);
    setEnvironmentId(null);
    setAvail(null);
    setSubmitError("");
    setDone(null);
  }

  if (done) {
    return (
      <ReservationConfirmation summary={done.summary} cancelToken={done.token} onReset={reset} />
    );
  }

  return (
    <div className="pb-44">
      <div className="px-[22px] pb-1 pt-[26px]">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <h1 className="m-0 font-serif text-[26px] text-espresso">Reservar uma mesa</h1>
          <Link
            href="/reservas/minhas"
            className="shrink-0 text-[13px] font-semibold text-dark-wine underline underline-offset-2"
          >
            Minhas reservas
          </Link>
        </div>
        <p className="m-0 text-[13.5px] leading-relaxed text-taupe">
          Escolha o dia, o horário, quantas pessoas vêm e o ambiente. A mesa é confirmada na hora.
        </p>
      </div>

      <div className="flex flex-col gap-3.5 px-[22px] pt-4">
        <Step n={1} title="Data" done={!!date}>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={atCurrentMonth}
              aria-label="Mês anterior"
              className="p-1.5 text-dark-wine disabled:opacity-30"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="m-0 font-serif text-[18px] text-espresso">
              {MONTHS[view.m]} {view.y}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Próximo mês"
              className="p-1.5 text-dark-wine"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-7 gap-1 text-center">
            {WEEK_HEAD.map((d, i) => (
              <span key={i} className="py-1 text-[12px] font-semibold text-taupe">
                {d}
              </span>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <span key={`e${i}`} />;
              const iso = toIso(view.y, view.m, day);
              const open = iso >= today && isOpenDate(iso);
              const selected = iso === date;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={!open}
                  onClick={() => {
                    setDate(iso);
                    // Hoje, horário que já passou deixa de valer.
                    if (time && iso === today && time <= nowTime) setTime(null);
                  }}
                  className={`aspect-square rounded-md font-sans text-[14px] font-semibold transition-colors ${
                    selected
                      ? "bg-dark-wine text-floral-white"
                      : open
                        ? "bg-floral-white text-espresso"
                        : "text-taupe/40"
                  } ${iso === today && !selected ? "border border-dark-wine" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <p className="m-0 mt-3 text-[12px] text-taupe">Fechado às segundas e terças.</p>
        </Step>

        <Step n={2} title="Horário" done={!!time}>
          {!date ? (
            <p className="m-0 text-[13px] text-taupe">
              Escolha uma data para ver os horários disponíveis.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {reservationTimesFor(date).map((t) => {
                const past = date === today && t <= nowTime;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={past}
                    onClick={() => setTime(t)}
                    className={`rounded-full border px-3.5 py-1.5 font-sans text-[13.5px] font-semibold ${
                      t === time
                        ? "border-dark-wine bg-dark-wine text-floral-white"
                        : past
                          ? "border-taupe/15 text-taupe/40"
                          : "border-dark-wine/40 text-dark-wine"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </Step>

        <Step n={3} title="Pessoas" done>
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              aria-label="Menos uma pessoa"
              className="flex size-11 items-center justify-center rounded-full border border-dark-wine/50 text-dark-wine"
            >
              <Minus className="size-5" />
            </button>
            <div className="text-center">
              <p className="m-0 font-serif text-[40px] leading-none text-espresso">{people}</p>
              <p className="m-0 mt-1 text-[13px] text-taupe">
                {people === 1 ? "pessoa" : "pessoas"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPeople((p) => Math.min(MAX_PEOPLE, p + 1))}
              aria-label="Mais uma pessoa"
              className="flex size-11 items-center justify-center rounded-full bg-dark-wine text-floral-white"
            >
              <Plus className="size-5" />
            </button>
          </div>
          {whatsappUrl && (
            <p className="m-0 mt-3.5 text-center text-[12.5px] text-taupe">
              Grupo acima de {MAX_PEOPLE} pessoas?{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-dark-wine underline underline-offset-2"
              >
                Fale com a gente
              </a>
            </p>
          )}
        </Step>

        <Step n={4} title="Ambiente" done={!!selectedEnv}>
          {!date || !time ? (
            <p className="m-0 text-[13px] text-taupe">
              Escolha data e horário para ver onde ainda há mesa.
            </p>
          ) : loadingEnv ? (
            <p className="m-0 text-[13px] text-taupe">Verificando disponibilidade...</p>
          ) : environments.length === 0 ? (
            <p className="m-0 text-[13px] text-taupe">
              Nenhum ambiente aceitando reservas no momento.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {environments.map((o) => {
                const selected = selectedEnv === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={!o.available}
                    onClick={() => setEnvironmentId(o.id)}
                    className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
                      selected
                        ? "border-dark-wine bg-dark-wine/5 ring-1 ring-dark-wine"
                        : "border-iron-grey/30 bg-floral-white"
                    } ${o.available ? "" : "cursor-not-allowed opacity-50"}`}
                  >
                    <span className="block font-sans text-sm font-semibold text-[#3B2A26]">
                      {o.name}
                    </span>
                    <span className="block text-[12.5px] text-taupe">
                      {o.available
                        ? (o.description ?? "Mesa disponível")
                        : "Sem mesas para esse horário"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Step>

        <Step n={5} title="Seus dados">
          <label className="block font-sans text-xs font-semibold uppercase tracking-[1px] text-iron-grey">
            Nome
            <input
              type="text"
              placeholder="Seu nome completo"
              autoComplete="name"
              value={name}
              onChange={(e) => setNameInput(e.target.value)}
              className={`${field} mt-1.5 font-normal normal-case tracking-normal`}
            />
          </label>
          <label className="mt-3.5 block font-sans text-xs font-semibold uppercase tracking-[1px] text-iron-grey">
            Contato (WhatsApp)
            <input
              type="tel"
              placeholder="(85) 99999-0000"
              autoComplete="tel"
              value={contact}
              onChange={(e) => setContactInput(e.target.value)}
              className={`${field} mt-1.5 font-normal normal-case tracking-normal`}
            />
          </label>
        </Step>

        {submitError && (
          <p role="alert" className="m-0 text-center text-[13px] text-[#8b3a2e]">
            {submitError}
          </p>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-[480px] border-t border-taupe/20 bg-floral-white px-[22px] pb-5 pt-3">
          <div className="flex items-center justify-between text-[13px] font-semibold">
            <span className="text-taupe first-letter:uppercase">
              {date ? `${formatDateLong(date)}${time ? ` · ${time}` : ""}` : "Nenhuma data escolhida"}
            </span>
            <span className="text-dark-wine">
              {people} {people === 1 ? "pessoa" : "pessoas"}
            </span>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!ready || isPending}
            className={`mt-2.5 w-full rounded-md py-3.5 font-sans text-[14.5px] font-semibold transition-colors ${
              ready ? "bg-dark-wine text-floral-white" : "bg-[#EDE4D6] text-taupe"
            }`}
          >
            {missing}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReservationConfirmation({
  summary,
  cancelToken,
  onReset,
}: {
  summary: string;
  cancelToken: string;
  onReset: () => void;
}) {
  return (
    <div className="px-[22px] pb-10 pt-[26px]">
      <div className="relative overflow-hidden rounded-lg bg-dark-wine px-6 py-9 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cobogo-wine.jpg')" }}
        />
        <div className="relative">
          <span
            aria-hidden
            className="mb-3.5 inline-block h-6 w-3 bg-floral-white"
            style={{
              WebkitMaskImage: "url('/images/cobogo-mark.png')",
              maskImage: "url('/images/cobogo-mark.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <h1 className="m-0 mb-2 font-serif text-[22px] text-floral-white">
            Mesa reservada
          </h1>
          <p className="mb-5 text-[13.5px] leading-relaxed text-[#F1DFC9]">
            {summary}
          </p>
          <p className="mb-3 text-[12.5px] text-[#F1DFC9]">
            Nossa equipe foi avisada da sua reserva. Até breve!
          </p>
          <p className="mb-[22px] text-[12.5px] text-[#F1DFC9]">
            Veja suas reservas em{" "}
            <Link
              href="/reservas/minhas"
              className="font-semibold underline underline-offset-2"
            >
              Minhas reservas
            </Link>
            . Precisa desmarcar?{" "}
            <Link
              href={`/reservas/cancelar/${cancelToken}`}
              className="font-semibold underline underline-offset-2"
            >
              Cancelar esta reserva
            </Link>
            . Guarde este link.
          </p>
          <div className="flex justify-center gap-2.5">
            <button
              onClick={onReset}
              className="rounded-md border border-floral-white bg-transparent px-4 py-2.5 text-[13px] font-semibold text-floral-white"
            >
              Nova reserva
            </button>
            <Link
              href="/cardapio"
              className="rounded-md bg-floral-white px-4 py-2.5 text-[13px] font-semibold text-dark-wine"
            >
              Ver cardápio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
