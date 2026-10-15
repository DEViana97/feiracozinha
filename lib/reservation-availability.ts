// Regras puras de disponibilidade (sem Prisma) - usadas pelas Server Actions.

// Tempo que uma reserva ocupa a mesa. Duas reservas conflitam se começam
// com menos que isso de diferença.
export const RESERVATION_DURATION_MIN = 120;

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function overlaps(a: string, b: string) {
  return Math.abs(toMinutes(a) - toMinutes(b)) < RESERVATION_DURATION_MIN;
}

// Fuso do restaurante (Ceará, UTC-3 sem horário de verão). O servidor roda em UTC,
// então "agora" precisa ser convertido para comparar com date/time das reservas.
const RESTAURANT_TZ = "America/Fortaleza";

// "Agora" no fuso do restaurante: { date: "YYYY-MM-DD", time: "HH:mm" }.
export function restaurantNow(now = new Date()) {
  const [date, time] = new Intl.DateTimeFormat("sv-SE", {
    timeZone: RESTAURANT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(now)
    .split(" ");
  return { date, time };
}

export function hasStarted(date: string, time: string, now = new Date()) {
  const n = restaurantNow(now);
  return `${date} ${time}` <= `${n.date} ${n.time}`;
}

// Funcionamento (ver landing/location.tsx). Dias seguem o JavaScript (0 = domingo);
// segunda e terça fechado. Cada dia tem faixas [abre, fecha] em "HH:mm".
export const OPENING_HOURS: Record<number, [string, string][]> = {
  0: [["12:00", "22:00"]],
  3: [["12:00", "15:00"], ["17:00", "22:00"]],
  4: [["12:00", "15:00"], ["17:00", "22:00"]],
  5: [["12:00", "15:00"], ["17:00", "22:00"]],
  6: [["12:00", "22:00"]],
};

function formatMinutes(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${total % 60 === 0 ? "00" : "30"}`;
}

// Horários de reserva de uma data "YYYY-MM-DD": de 30 em 30 minutos, do horário em que
// abre até 2h antes de fechar (a mesa fica ocupada por RESERVATION_DURATION_MIN).
export function reservationTimesFor(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const ranges = OPENING_HOURS[new Date(y, m - 1, d).getDay()] ?? [];
  return ranges.flatMap(([open, close]) => {
    const times: string[] = [];
    for (let t = toMinutes(open); t <= toMinutes(close) - RESERVATION_DURATION_MIN; t += 30) {
      times.push(formatMinutes(t));
    }
    return times;
  });
}

export function isOpenDate(date: string) {
  return reservationTimesFor(date).length > 0;
}

type Group = { seats: number; quantity: number };
type Booked = { time: string; tableSeats: number };

// Menor mesa livre que comporta o grupo, ou null se não houver.
export function pickTable(groups: Group[], booked: Booked[], time: string, people: number) {
  const fit = [...groups]
    .sort((a, b) => a.seats - b.seats)
    .find((g) => {
      if (g.seats < people) return false;
      const taken = booked.filter((r) => r.tableSeats === g.seats && overlaps(r.time, time));
      return g.quantity - taken.length > 0;
    });
  return fit ? fit.seats : null;
}
