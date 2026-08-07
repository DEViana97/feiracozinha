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
import { SortableItem } from "@/components/admin/sortable-item";
import { SlideFormDialog } from "@/components/admin/slide-form-dialog";
import { deleteSlide, reorderSlides, toggleSlideActive } from "@/lib/actions/slide";

type Slide = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
  active: boolean;
};

export function SlideManager({ slides }: { slides: Slide[] }) {
  const [items, setItems] = useState(slides);
  useEffect(() => setItems(slides), [slides]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);
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
      reorderSlides(next.map((i) => i.id));
    });
  }

  function handleToggle(id: string, active: boolean) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, active } : s)));
    startTransition(async () => {
      try {
        await toggleSlideActive(id, active);
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
        await deleteSlide(id);
        setItems((prev) => prev.filter((s) => s.id !== id));
        toast.success("Foto excluída.");
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
          Nova foto
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((slide) => (
              <SortableItem key={slide.id} id={slide.id}>
                <div className="flex items-center gap-3 py-2 pr-2">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.caption}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{slide.caption}</p>
                  </div>
                  <Switch
                    checked={slide.active}
                    onCheckedChange={(checked) => handleToggle(slide.id, checked)}
                  />
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(slide);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setDeletingId(slide.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </SortableItem>
            ))}
            {items.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma foto cadastrada ainda.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <SlideFormDialog open={dialogOpen} onOpenChange={setDialogOpen} slide={editing} />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
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
