// Gestão de tags temporariamente desativada — ver nota em AGENTS.md.
// Componente inteiro comentado abaixo pra reativar facilmente depois.
/*
"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AVAILABLE_TAG_ICONS, getTagIcon } from "@/lib/tag-icons";
import { tagSchema, type TagInput } from "@/lib/validations/tag";
import { createTag, updateTag, deleteTag } from "@/lib/actions/tag";

type Tag = { id: string; name: string; icon: string; type: string };

const TYPE_LABELS: Record<string, string> = {
  ALERGENICO: "Alergênico",
  DIETA: "Dieta",
  INTENSIDADE: "Intensidade",
};

export function TagManager({ tags }: { tags: Tag[] }) {
  const [items, setItems] = useState(tags);
  useEffect(() => setItems(tags), [tags]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TagInput>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "", icon: AVAILABLE_TAG_ICONS[0], type: "DIETA" },
  });

  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        name: editing?.name ?? "",
        icon: editing?.icon ?? AVAILABLE_TAG_ICONS[0],
        type: (editing?.type as TagInput["type"]) ?? "DIETA",
      });
    }
  }, [dialogOpen, editing, form]);

  function onSubmit(values: TagInput) {
    startTransition(async () => {
      try {
        if (editing) {
          await updateTag(editing.id, values);
          toast.success("Tag atualizada.");
        } else {
          await createTag(values);
          toast.success("Tag criada.");
        }
        setDialogOpen(false);
      } catch {
        toast.error("Não foi possível salvar a tag.");
      }
    });
  }

  function handleDelete() {
    if (!deletingId) return;
    const id = deletingId;
    startTransition(async () => {
      try {
        await deleteTag(id);
        setItems((prev) => prev.filter((t) => t.id !== id));
        toast.success("Tag excluída.");
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
          Nova tag
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((tag) => {
          const Icon = getTagIcon(tag.icon);
          return (
            <div
              key={tag.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <Icon className="size-4 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{tag.name}</p>
                <p className="text-xs text-muted-foreground">
                  {TYPE_LABELS[tag.type] ?? tag.type}
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => {
                  setEditing(tag);
                  setDialogOpen(true);
                }}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => setDeletingId(tag.id)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma tag cadastrada.</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tag" : "Nova tag"}</DialogTitle>
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
                      <Input placeholder="Ex.: Contém Glúten" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {(value: string) => TYPE_LABELS[value] ?? value}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALERGENICO">Alergênico</SelectItem>
                        <SelectItem value="DIETA">Dieta</SelectItem>
                        <SelectItem value="INTENSIDADE">Intensidade</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAG_ICONS.map((iconName) => {
                        const Icon = getTagIcon(iconName);
                        const selected = field.value === iconName;
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => field.onChange(iconName)}
                            className={`flex size-9 items-center justify-center rounded-md border transition-colors ${
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }`}
                          >
                            <Icon className="size-4" />
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
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

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tag?</AlertDialogTitle>
            <AlertDialogDescription>
              A tag será removida de todos os itens que a utilizam. Esta ação não pode ser desfeita.
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

*/
