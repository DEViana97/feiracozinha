"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemCard } from "@/components/public/menu-item-card";
import type { SerializedCategory } from "@/lib/types";

const TYPE_ALL = "todos";
const TYPE_WINE = "vinhos";
const TYPE_COCKTAIL = "coqueteis";

export function WineSection({ category }: { category: SerializedCategory }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(TYPE_ALL);

  const filtered = useMemo(() => {
    return category.menuItems.filter((item) => {
      const matchesQuery = query
        ? item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        : true;

      const isWine = item.variants.length > 0;
      const matchesType =
        type === TYPE_ALL ||
        (type === TYPE_WINE && isWine) ||
        (type === TYPE_COCKTAIL && !isWine);

      return matchesQuery && matchesType;
    });
  }, [category.menuItems, query, type]);

  return (
    <section id="da-adega" className="px-4 py-8 border-t border-border">
      <h2 className="font-serif text-2xl mb-1">{category.name}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Vinhos e coquetéis para acompanhar sua mesa.
      </p>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar na adega..."
            className="pl-9 h-10"
          />
        </div>
        <Tabs value={type} onValueChange={setType}>
          <TabsList>
            <TabsTrigger value={TYPE_ALL}>Todos</TabsTrigger>
            <TabsTrigger value={TYPE_WINE}>Vinhos</TabsTrigger>
            <TabsTrigger value={TYPE_COCKTAIL}>Coquetéis</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
            Nenhum item encontrado.
          </p>
        )}
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
