"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { formatPrice } from "@/lib/format";
import { deleteMenuItem, toggleMenuItemActive } from "@/lib/actions/item";

type Item = {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  imageUrl: string | null;
  active: boolean;
  category: { id: string; name: string };
};

const ALL_CATEGORIES = "__all__";

export function ItemList({
  items,
  categories,
}: {
  items: Item[];
  categories: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = query
        ? item.name.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesCategory =
        categoryFilter === ALL_CATEGORIES || item.category.id === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [items, query, categoryFilter]);

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      try {
        await toggleMenuItemActive(id, active);
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
        await deleteMenuItem(id);
        toast.success("Item excluído.");
      } catch {
        toast.error("Não foi possível excluir.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar item..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v ?? ALL_CATEGORIES)}
          >
            <SelectTrigger className="w-48">
              <SelectValue>
                {(value: string) =>
                  value === ALL_CATEGORIES
                    ? "Todas categorias"
                    : categories.find((c) => c.id === value)?.name
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Todas categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          nativeButton={false}
          render={
            <Link href="/admin/items/new">
              <Plus className="size-4" />
              Novo item
            </Link>
          }
        />
      </div>

      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.name} fill sizes="48px" className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.category.name}</p>
            </div>
            <span className="shrink-0 text-sm text-primary">{formatPrice(item.basePrice)}</span>
            <Switch
              checked={item.active}
              onCheckedChange={(checked) => handleToggle(item.id, checked)}
            />
            <Button
              size="icon-sm"
              variant="ghost"
              nativeButton={false}
              render={
                <Link href={`/admin/items/${item.id}/edit`}>
                  <Pencil className="size-3.5" />
                </Link>
              }
            />
            <Button size="icon-sm" variant="ghost" onClick={() => setDeletingId(item.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum item encontrado.
          </p>
        )}
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir item?</AlertDialogTitle>
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
