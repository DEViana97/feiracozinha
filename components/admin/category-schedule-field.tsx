"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ALL_DAYS, DAY_SHORT, DAY_START, DAY_END, WEEK_ORDER, type CategoryWindow } from "@/lib/category-schedule";

type Mode = "always" | "hours" | "custom";

const MODES: { key: Mode; title: string; hint: string }[] = [
  { key: "always", title: "Todos os dias", hint: "Sempre visível, o dia todo." },
  { key: "hours", title: "Todos os dias, em certo horário", hint: "Ex.: Happy Hour das 15h às 20h." },
  { key: "custom", title: "Dias e horários específicos", hint: "Ex.: Almoço Executivo, de quarta a sexta." },
];

const hoursWindow = (): CategoryWindow => ({ days: [...ALL_DAYS], start: "15:00", end: "20:00" });
const customWindow = (): CategoryWindow => ({ days: [3, 4, 5], start: DAY_START, end: DAY_END });

// Vazio = sempre; uma janela com os 7 dias = todos os dias em certo horário; o resto = específico.
function deriveMode(value: CategoryWindow[]): Mode {
  if (value.length === 0) return "always";
  if (value.length === 1 && value[0].days.length === 7 && !(value[0].start === DAY_START && value[0].end === DAY_END)) {
    return "hours";
  }
  return "custom";
}

// "Quando aparece no cardápio": todos os dias, todos os dias em certo horário, ou dias e horários específicos.
export function CategoryScheduleField({
  value,
  onChange,
}: {
  value: CategoryWindow[];
  onChange: (next: CategoryWindow[]) => void;
}) {
  // O modo escolhido pela pessoa vale enquanto ela edita (ex.: tirar um dia não troca de modo);
  // antes disso ele vem do valor salvo.
  const [picked, setPicked] = useState<Mode | null>(null);
  const mode = picked ?? deriveMode(value);

  function choose(next: Mode) {
    setPicked(next);
    onChange(next === "always" ? [] : next === "hours" ? [hoursWindow()] : [customWindow()]);
  }

  const patch = (i: number, p: Partial<CategoryWindow>) => onChange(value.map((w, j) => (j === i ? { ...w, ...p } : w)));
  const toggleDay = (i: number, day: number) =>
    patch(i, { days: value[i].days.includes(day) ? value[i].days.filter((d) => d !== day) : [...value[i].days, day] });

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div role="radiogroup" aria-label="Quando aparece" className="space-y-1.5">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            role="radio"
            aria-checked={mode === m.key}
            onClick={() => choose(m.key)}
            className={cn(
              "flex w-full flex-col items-start rounded-md border px-3 py-2 text-left",
              mode === m.key ? "border-primary bg-primary/5" : "border-border"
            )}
          >
            <span className="text-sm font-medium">{m.title}</span>
            <span className="text-xs text-muted-foreground">{m.hint}</span>
          </button>
        ))}
      </div>

      {mode !== "always" && (
        <div className="space-y-3">
          {value.map((w, i) => {
            const allDay = w.start === DAY_START && w.end === DAY_END;
            return (
              <div key={i} className="space-y-2 rounded-md bg-muted/50 p-2.5">
                {mode === "custom" && (
                  <div role="group" aria-label="Dias da semana" className="flex flex-wrap gap-1">
                    {WEEK_ORDER.map((d) => {
                      const on = w.days.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleDay(i, d)}
                          className={cn(
                            "h-9 min-w-11 rounded-md border px-2 text-sm font-medium",
                            on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                          )}
                        >
                          {DAY_SHORT[d]}
                        </button>
                      );
                    })}
                  </div>
                )}
                {mode === "custom" && (
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={allDay}
                      onCheckedChange={(on) =>
                        patch(i, on ? { start: DAY_START, end: DAY_END } : { start: "12:00", end: "20:00" })
                      }
                    />
                    O dia todo
                  </label>
                )}
                {!allDay && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    das
                    <Input
                      type="time"
                      aria-label="Início"
                      value={w.start}
                      onChange={(e) => e.target.value && patch(i, { start: e.target.value })}
                      className="w-32"
                    />
                    às
                    <Input
                      type="time"
                      aria-label="Fim"
                      value={w.end}
                      onChange={(e) => e.target.value && patch(i, { end: e.target.value })}
                      className="w-32"
                    />
                  </div>
                )}
                {mode === "custom" && value.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onChange(value.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="size-3.5" />
                    Remover esta janela
                  </Button>
                )}
                {(w.days.length === 0 || w.end <= w.start) && (
                  <p role="alert" className="text-xs text-destructive">
                    {w.days.length === 0 ? "Escolha ao menos um dia." : "O fim precisa ser depois do início."}
                  </p>
                )}
              </div>
            );
          })}
          {mode === "custom" && (
            <Button type="button" size="sm" variant="outline" onClick={() => onChange([...value, customWindow()])}>
              <Plus className="size-4" />
              Outra janela
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
