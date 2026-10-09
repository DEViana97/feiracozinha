"use client";

import { useEffect, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  environmentSchema,
  type EnvironmentInput,
} from "@/lib/validations/reservation";
import { createEnvironment, updateEnvironment } from "@/lib/actions/reservation";

export type EditableEnvironment = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  tableGroups: { seats: number; quantity: number }[];
} | null;

const emptyValues: EnvironmentInput = {
  name: "",
  description: "",
  active: true,
  tableGroups: [{ seats: 2, quantity: 1 }],
};

export function EnvironmentFormDialog({
  open,
  onOpenChange,
  environment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  environment: EditableEnvironment;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EnvironmentInput>({
    resolver: zodResolver(environmentSchema),
    defaultValues: emptyValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tableGroups",
  });

  useEffect(() => {
    if (open) {
      form.reset(
        environment
          ? {
              name: environment.name,
              description: environment.description ?? "",
              active: environment.active,
              tableGroups: environment.tableGroups.map((g) => ({
                seats: g.seats,
                quantity: g.quantity,
              })),
            }
          : emptyValues
      );
    }
  }, [open, environment, form]);

  function onSubmit(values: EnvironmentInput) {
    startTransition(async () => {
      try {
        if (environment) {
          await updateEnvironment(environment.id, values);
          toast.success("Ambiente atualizado.");
        } else {
          await createEnvironment(values);
          toast.success("Ambiente criado.");
        }
        onOpenChange(false);
      } catch {
        toast.error("Não foi possível salvar o ambiente.");
      }
    });
  }

  const groupsError = form.formState.errors.tableGroups;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{environment ? "Editar ambiente" : "Novo ambiente"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Ambiente externo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex.: Varanda aberta com vista para o jardim"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mesas</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => append({ seats: 4, quantity: 1 })}
                >
                  <Plus className="size-3.5" />
                  Tipo de mesa
                </Button>
              </div>
              {fields.map((row, index) => (
                <div key={row.id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`tableGroups.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            aria-label="Quantidade de mesas"
                            value={Number.isNaN(field.value) ? "" : field.value}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span className="pt-2 text-sm text-muted-foreground">mesa(s) de</span>
                  <FormField
                    control={form.control}
                    name={`tableGroups.${index}.seats`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            aria-label="Lugares por mesa"
                            value={Number.isNaN(field.value) ? "" : field.value}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span className="pt-2 text-sm text-muted-foreground">lugares</span>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    aria-label="Remover tipo de mesa"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
              {groupsError && !Array.isArray(groupsError) && (
                <p className="text-sm text-destructive">
                  {groupsError.message ?? groupsError.root?.message}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel>Aceita reservas</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
