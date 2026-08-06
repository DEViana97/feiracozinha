"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function SortableItem({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card",
        isDragging && "opacity-60",
        className
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none px-2 py-3 text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        aria-label="Reordenar"
      >
        <GripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
