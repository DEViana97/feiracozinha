"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import {
  EnvironmentFormDialog,
  type EditableEnvironment,
} from "@/components/admin/environment-form-dialog";
import { deleteEnvironment, toggleEnvironmentActive } from "@/lib/actions/reservation";

type Environment = NonNullable<EditableEnvironment>;

export function EnvironmentManager({ environments }: { environments: Environment[] }) {
  const [items, setItems] = useState(environments);
  // Ressincroniza quando o servidor manda dados novos (sem useEffect).
  const [prevEnvironments, setPrevEnvironments] = useState(environments);
  if (prevEnvironments !== environments) {
    setPrevEnvironments(environments);
    setItems(environments);
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditableEnvironment>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(id: string, active: boolean) {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, active } : e)));
    startTransition(async () => {
      try {
        await toggleEnvironmentActive(id, active);
      } catch {
        toast.error("Não foi possível atualizar.");
      }
    });
  }

  function handleDelete() {
    if (!deletingId) return;
    const id = deletingId;
    startTransition(async () => {
      try {
        await deleteEnvironment(id);
        setItems((prev) => prev.filter((e) => e.id !== id));
        toast.success("Ambiente excluído.");
      } catch {
        toast.error("Não foi possível excluir.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Novo ambiente
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((env) => {
          const totalTables = env.tableGroups.reduce((s, g) => s + g.quantity, 0);
          const totalSeats = env.tableGroups.reduce((s, g) => s + g.quantity * g.seats, 0);
          return (
            <div key={env.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{env.name}</p>
                  {env.description && (
                    <p className="text-sm text-muted-foreground">{env.description}</p>
                  )}
                </div>
                <Switch
                  checked={env.active}
                  onCheckedChange={(checked) => handleToggle(env.id, checked)}
                  aria-label="Aceita reservas"
                />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Editar"
                  onClick={() => {
                    setEditing(env);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Excluir"
                  onClick={() => setDeletingId(env.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {env.tableGroups.map((g) => (
                  <span
                    key={g.seats}
                    className="rounded-md bg-muted px-2.5 py-1 text-sm"
                  >
                    {g.quantity} {g.quantity === 1 ? "mesa" : "mesas"} de {g.seats}{" "}
                    {g.seats === 1 ? "lugar" : "lugares"}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {totalTables} {totalTables === 1 ? "mesa" : "mesas"} · {totalSeats} lugares
                no total
              </p>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum ambiente cadastrado ainda.
          </p>
        )}
      </div>

      <EnvironmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        environment={editing}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir ambiente?</AlertDialogTitle>
            <AlertDialogDescription>
              As reservas deste ambiente também serão apagadas. Para só parar de aceitar
              reservas, desative o ambiente. Esta ação não pode ser desfeita.
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
