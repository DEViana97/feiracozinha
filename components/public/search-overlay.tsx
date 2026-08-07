"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";

type SearchItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  imageUrl: string | null;
  category: { name: string; slug: string };
};

export function SearchOverlay({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.name.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Buscar no cardápio">
            <Search className="size-5" />
          </Button>
        }
      />
      <SheetContent side="top" className="h-[85vh] bg-background">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Buscar</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4 space-y-4 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar pratos, ingredientes..."
              className="pl-9 h-11"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          {query && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum item encontrado para &ldquo;{query}&rdquo;.
            </p>
          )}

          <ul className="space-y-3">
            {results.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/cardapio/${item.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 items-center rounded-lg p-2 hover:bg-accent transition-colors"
                >
                  <div className="relative size-14 shrink-0 rounded-md overflow-hidden bg-muted">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.category.name}
                    </p>
                  </div>
                  <span className="text-sm text-primary shrink-0">
                    {formatPrice(item.basePrice)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
