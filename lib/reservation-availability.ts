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

export function hasStarted(date: string, time: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: RESTAURANT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now); // "YYYY-MM-DD HH:mm"
  return `${date} ${time}` <= parts;
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
