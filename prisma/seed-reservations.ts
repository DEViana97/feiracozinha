// Dados de demonstração das reservas. Idempotente e NÃO apaga nada:
// só cria os ambientes/reservas se ainda não existirem ambientes com esses nomes.
import { PrismaClient } from "@prisma/client";
import { contactKey } from "../lib/contact-key";

const prisma = new PrismaClient();

function isoDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function main() {
  const existing = await prisma.environment.count({
    where: { name: { in: ["Ambiente externo", "Ambiente interno"] } },
  });
  if (existing > 0) {
    console.log("Ambientes de demonstração já existem; nada a fazer.");
    return;
  }

  const externo = await prisma.environment.create({
    data: {
      name: "Ambiente externo",
      description: "Varanda aberta, com ventilação natural",
      order: 0,
      tableGroups: {
        create: [
          { seats: 2, quantity: 3 },
          { seats: 4, quantity: 2 },
        ],
      },
    },
  });
  const interno = await prisma.environment.create({
    data: {
      name: "Ambiente interno",
      description: "Salão climatizado",
      order: 1,
      tableGroups: {
        create: [
          { seats: 2, quantity: 4 },
          { seats: 4, quantity: 3 },
          { seats: 8, quantity: 1 },
        ],
      },
    },
  });

  const e = externo.id;
  const i = interno.id;
  const hoje = isoDate(0);
  const amanha = isoDate(1);

  const rows = [
    // Hoje
    { environmentId: i, date: hoje, time: "19:30", people: 2, tableSeats: 2, name: "Mariana Costa", contact: "(85) 99812-3456" },
    { environmentId: e, date: hoje, time: "20:00", people: 4, tableSeats: 4, name: "Rafael Lima", contact: "(85) 98877-1020" },
    { environmentId: i, date: hoje, time: "21:00", people: 6, tableSeats: 8, name: "Família Albuquerque", contact: "(85) 99701-5544" },
    // Amanhã: externo lotado às 20:00 (3 mesas de 2 + 2 de 4)
    { environmentId: e, date: amanha, time: "20:00", people: 2, tableSeats: 2, name: "Camila Rocha", contact: "(85) 99123-0001" },
    { environmentId: e, date: amanha, time: "20:00", people: 2, tableSeats: 2, name: "João Pedro", contact: "(85) 99123-0002" },
    { environmentId: e, date: amanha, time: "20:00", people: 1, tableSeats: 2, name: "Beatriz Nunes", contact: "(85) 99123-0003" },
    { environmentId: e, date: amanha, time: "20:00", people: 4, tableSeats: 4, name: "Lucas Moreira", contact: "(85) 99123-0004" },
    { environmentId: e, date: amanha, time: "20:00", people: 3, tableSeats: 4, name: "Patrícia Dias", contact: "(85) 99123-0005" },
    { environmentId: i, date: amanha, time: "12:30", people: 4, tableSeats: 4, name: "Empresa Alfa (almoço)", contact: "(85) 3222-9000" },
    // Próximos dias
    { environmentId: i, date: isoDate(3), time: "20:30", people: 2, tableSeats: 2, name: "Aline e Bruno", contact: "(85) 98700-4321" },
    { environmentId: e, date: isoDate(5), time: "19:00", people: 4, tableSeats: 4, name: "Tiago Ferreira", contact: "(85) 99650-7788" },
    // Passada e cancelada
    { environmentId: i, date: isoDate(-2), time: "20:00", people: 2, tableSeats: 2, name: "Helena Prado", contact: "(85) 99555-1212" },
    { environmentId: e, date: isoDate(2), time: "19:30", people: 2, tableSeats: 2, name: "Vitor Sales", contact: "(85) 99444-3030", status: "CANCELLED" as const },
  ];

  await prisma.reservation.createMany({
    data: rows.map((r) => ({ ...r, contactKey: contactKey(r.contact) })),
  });
  console.log(`Criados 2 ambientes e ${rows.length} reservas de demonstração.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
