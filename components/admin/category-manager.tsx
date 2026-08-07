"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
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
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
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
import { SortableItem } from "@/components/admin/sortable-item";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { SubcategoryManager } from "@/components/admin/subcategory-manager";
import {
  deleteCategory,
  reorderCategories,
  toggleCategoryActive,
} from "@/lib/actions/category";
import type { SerializedCategory } from "@/lib/types";

type CategoryWithSub = SerializedCategory;

export function CategoryManager({ categories }: { categories: CategoryWithSub[] }) {
  const [items, setItems] = useState(categories);
  useEffect(() => setItems(categories), [categories]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryWithSub | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    startTransition(() => {
      reorderCategories(next.map((i) => i.id));
    });
  }

  function handleToggle(id: string, active: boolean) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, active } as CategoryWithSub : c)));
    startTransition(async () => {
      try {
        await toggleCategoryActive(id, active);
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
        await deleteCategory(id);
        setItems((prev) => prev.filter((c) => c.id !== id));
        toast.success("Categoria excluída.");
      } catch {
        toast.error("Não foi possível excluir. Verifique se ela não possui itens.");
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
          Nova categoria
        </Button>
      </div>

      <DndContext id="categories-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((cat) => (
              <SortableItem key={cat.id} id={cat.id}>
                <div className="flex items-center gap-3 py-2 pr-2">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    {cat.coverImageUrl && (
                      <Image
                        src={cat.coverImageUrl}
                        alt={cat.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cat.subcategories.length} subcategoria(s) · {cat.menuItems.length} item(ns)
                    </p>
                  </div>
                  <Switch
                    checked={cat.active}
                    onCheckedChange={(checked) => handleToggle(cat.id, checked)}
                  />
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(cat);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setDeletingId(cat.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
                  >
                    {expandedId === cat.id ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </Button>
                </div>
                {expandedId === cat.id && (
                  <SubcategoryManager categoryId={cat.id} subcategories={cat.subcategories} />
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={
          editing
            ? {
                id: editing.id,
                name: editing.name,
                coverImageUrl: editing.coverImageUrl,
                active: editing.active,
              }
            : null
        }
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os itens e subcategorias vinculados a ela também serão excluídos. Esta ação não pode ser desfeita.
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
