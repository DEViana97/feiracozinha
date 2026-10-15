"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { Ban, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cancelReservation, deleteReservation } from "@/lib/actions/reservation";
import { cn } from "@/lib/utils";

type Reservation = {
  id: string;
  date: string;
  time: string;
  people: number;
  tableSeats: number;
  name: string;
  contact: string;
  status: "CONFIRMED" | "CANCELLED";
  environment: { name: string };
};

type Filter = "upcoming" | "past" | "cancelled";

const filters: { value: Filter; label: string }[] = [
  { value: "upcoming", label: "Próximas" },
  { value: "past", label: "Passadas" },
  { value: "cancelled", label: "Canceladas" },
];

function todayLocal() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDay(date: string, today: string) {
  const label = new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  return date === today ? `Hoje · ${label}` : label;
}

export function ReservationList({ reservations }: { reservations: Reservation[] }) {
  const [items, setItems] = useState(reservations);
  const [prevReservations, setPrevReservations] = useState(reservations);
  if (prevReservations !== reservations) {
    setPrevReservations(reservations);
    setItems(reservations);
  }

  const [filter, setFilter] = useState<Filter>("upcoming");
  // "Hoje" vem do fuso do navegador, então só existe depois de hidratar.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const today = mounted ? todayLocal() : null;

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (!today) return null;

  const visible = items
    .filter((r) => {
      if (filter === "cancelled") return r.status === "CANCELLED";
      if (r.status === "CANCELLED") return false;
      return filter === "upcoming" ? r.date >= today : r.date < today;
    })
    .sort((a, b) =>
      filter === "past"
        ? `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
        : `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );

  const byDay = new Map<string, Reservation[]>();
  for (const r of visible) byDay.set(r.date, [...(byDay.get(r.date) ?? []), r]);

  function handleCancel(id: string) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" } : r)));
    startTransition(async () => {
      try {
        await cancelReservation(id);
        toast.success("Reserva cancelada.");
      } catch {
        toast.error("Não foi possível cancelar.");
      }
    });
  }

  function handleDelete() {
    if (!deletingId) return;
    const id = deletingId;
    startTransition(async () => {
      try {
        await deleteReservation(id);
        setItems((prev) => prev.filter((r) => r.id !== id));
        toast.success("Reserva excluída.");
      } catch {
        toast.error("Não foi possível excluir.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {[...byDay.entries()].map(([date, rows]) => (
        <section key={date} className="space-y-2">
          <h3 className="text-sm font-medium capitalize text-muted-foreground">
            {formatDay(date, today)} · {rows.length}{" "}
            {rows.length === 1 ? "reserva" : "reservas"}
          </h3>
          {rows.map((r) => {
            const digits = r.contact.replace(/\D/g, "");
            const tel = `tel:+${digits.startsWith("55") ? digits : `55${digits}`}`;
            return (
              <div
                key={r.id}
                className={cn(
                  "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border p-3",
                  r.status === "CANCELLED" && "opacity-60"
                )}
              >
                <span className="w-14 font-serif text-lg">{r.time}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {r.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {r.people} {r.people === 1 ? "pessoa" : "pessoas"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {r.environment.name} · mesa de {r.tableSeats} ·{" "}
                    <a
                      href={tel}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {r.contact}
                    </a>
                  </p>
                </div>
                {r.status === "CANCELLED" && <Badge variant="outline">Cancelada</Badge>}
                {r.status === "CONFIRMED" && r.date >= today && (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Cancelar reserva"
                    onClick={() => handleCancel(r.id)}
                  >
                    <Ban className="size-3.5" />
                  </Button>
                )}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Excluir reserva"
                  onClick={() => setDeletingId(r.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            );
          })}
        </section>
      ))}

      {visible.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma reserva nesta lista.
        </p>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              A reserva some do histórico e a mesa é liberada. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
