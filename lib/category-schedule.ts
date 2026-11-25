// Quando uma categoria aparece no cardápio público. Sem janelas = sempre visível.
// Dias seguem o JavaScript (0 = domingo); "start" entra e "end" não ("06:00" a "15:00" cobre
// 06:00 até 14:59). Horário no fuso do restaurante. A janela fica dentro do mesmo dia.
import { restaurantNow } from "@/lib/reservation-availability";

export type CategoryWindow = { days: number[]; start: string; end: string };

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const DAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
// Semana começando na segunda, como no restaurante.
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export function parseAvailability(value: unknown): CategoryWindow[] {
  if (!Array.isArray(value)) return [];
  const out: CategoryWindow[] = [];
  for (const w of value as Partial<CategoryWindow>[]) {
    if (!w || !Array.isArray(w.days) || typeof w.start !== "string" || typeof w.end !== "string") continue;
    if (!HHMM.test(w.start) || !HHMM.test(w.end) || w.end <= w.start) continue;
    const days = [...new Set(w.days.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6))];
    if (days.length) out.push({ days, start: w.start, end: w.end });
  }
  return out;
}

export function isCategoryOpen(value: unknown, now = new Date()) {
  const windows = parseAvailability(value);
  if (windows.length === 0) return true;
  const { date, time } = restaurantNow(now);
  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  return windows.some((w) => w.days.includes(weekday) && time >= w.start && time < w.end);
}

const hour = (t: string) => {
  const [h, m] = t.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
};

// "Qua a Sex 6h–15h · Sáb e Dom 12h–20h"
export function describeAvailability(value: unknown) {
  const windows = parseAvailability(value);
  if (windows.length === 0) return "Sempre visível";
  return windows
    .map((w) => {
      const idx = WEEK_ORDER.filter((d) => w.days.includes(d));
      let days: string;
      if (idx.length === 7) days = "Todos os dias";
      else {
        // Agrupa dias seguidos (na ordem seg..dom) em "A a B".
        const pos = idx.map((d) => WEEK_ORDER.indexOf(d));
        const runs: number[][] = [];
        for (const p of pos) {
          const last = runs[runs.length - 1];
          if (last && p === last[last.length - 1] + 1) last.push(p);
          else runs.push([p]);
        }
        const parts = runs.map((r) =>
          r.length >= 3
            ? `${DAY_SHORT[WEEK_ORDER[r[0]]]} a ${DAY_SHORT[WEEK_ORDER[r[r.length - 1]]]}`
            : r.map((p) => DAY_SHORT[WEEK_ORDER[p]]).join(" e ")
        );
        days = parts.join(", ");
      }
      return `${days} ${hour(w.start)}–${hour(w.end)}`;
    })
    .join(" · ");
}
