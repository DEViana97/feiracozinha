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

// Funcionamento (terça a domingo, 12h às 23h; ver landing/location.tsx). Dias seguem o
// JavaScript (0 = domingo). A última reserva sai às 21h para a mesa de 2h caber no dia.
export const OPEN_DAYS = [0, 2, 3, 4, 5, 6];
export const RESERVATION_TIMES = Array.from({ length: 19 }, (_, i) => {
  const minutes = 12 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`;
});

export function isOpenDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return OPEN_DAYS.includes(new Date(y, m - 1, d).getDay());
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
