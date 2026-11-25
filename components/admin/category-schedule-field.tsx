"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { DAY_SHORT, WEEK_ORDER, type CategoryWindow } from "@/lib/category-schedule";

const NEW_WINDOW: CategoryWindow = { days: [0, 1, 2, 3, 4, 5, 6], start: "12:00", end: "23:00" };

// "Quando aparece no cardápio": sempre, ou em janelas de dias e horários.
export function CategoryScheduleField({
  value,
  onChange,
}: {
  value: CategoryWindow[];
  onChange: (next: CategoryWindow[]) => void;
}) {
  const always = value.length === 0;
  const patch = (i: number, p: Partial<CategoryWindow>) =>
    onChange(value.map((w, j) => (j === i ? { ...w, ...p } : w)));
  const toggleDay = (i: number, day: number) => {
    const days = value[i].days.includes(day) ? value[i].days.filter((d) => d !== day) : [...value[i].days, day];
    patch(i, { days });
  };

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Sempre visível</p>
          <p className="text-xs text-muted-foreground">
            Desligue para mostrar a categoria só em certos dias e horários.
          </p>
        </div>
        <Switch checked={always} onCheckedChange={(on) => onChange(on ? [] : [NEW_WINDOW])} />
      </div>

      {!always && (
        <div className="space-y-3">
          {value.map((w, i) => (
            <div key={i} className="space-y-2 rounded-md bg-muted/50 p-2.5">
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
                {value.length > 1 && (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Remover janela"
                    className="ml-auto"
                    onClick={() => onChange(value.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
              {(w.days.length === 0 || w.end <= w.start) && (
                <p role="alert" className="text-xs text-destructive">
                  {w.days.length === 0 ? "Escolha ao menos um dia." : "O fim precisa ser depois do início."}
                </p>
              )}
            </div>
          ))}
          <Button type="button" size="sm" variant="outline" onClick={() => onChange([...value, NEW_WINDOW])}>
            <Plus className="size-4" />
            Outra janela
          </Button>
        </div>
      )}
    </div>
  );
}
