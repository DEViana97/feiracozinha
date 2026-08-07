"use client";

import { useEffect, useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SortableItem } from "@/components/admin/sortable-item";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  reorderSubcategories,
} from "@/lib/actions/category";

type Subcategory = { id: string; name: string; order: number };

export function SubcategoryManager({
  categoryId,
  subcategories,
}: {
  categoryId: string;
  subcategories: Subcategory[];
}) {
  const [items, setItems] = useState(subcategories);
  useEffect(() => setItems(subcategories), [subcategories]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      try {
        await createSubcategory({ categoryId, name });
        setNewName("");
      } catch {
        toast.error("Não foi possível criar a subcategoria.");
      }
    });
  }

  function handleUpdate(id: string) {
    const name = editingName.trim();
    if (!name) return;
    startTransition(async () => {
      try {
        await updateSubcategory(id, name);
        setEditingId(null);
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
        await deleteSubcategory(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Subcategoria excluída.");
      } catch {
        toast.error("Não foi possível excluir.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(() => {
      reorderSubcategories(next.map((i) => i.id));
    });
  }

  return (
    <div className="space-y-2 pl-8 pr-3 pb-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {items.map((sub) => (
              <SortableItem key={sub.id} id={sub.id} className="py-1 pr-2">
                {editingId === sub.id ? (
                  <div className="flex items-center gap-1.5 py-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-7"
                      autoFocus
                    />
                    <Button size="icon-sm" variant="ghost" onClick={() => handleUpdate(sub.id)}>
                      <Check className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">{sub.name}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(sub.id);
                          setEditingName(sub.name);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button size="icon-sm" variant="ghost" onClick={() => setDeletingId(sub.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-1.5 pt-1">
        <Input
          placeholder="Nova subcategoria"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="h-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button size="sm" variant="outline" disabled={isPending} onClick={handleAdd}>
          <Plus className="size-3.5" />
          Adicionar
        </Button>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir subcategoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Os itens vinculados a ela permanecerão na categoria, mas sem subcategoria. Esta ação não pode ser desfeita.
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
