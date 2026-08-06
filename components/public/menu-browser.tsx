"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemCard } from "@/components/public/menu-item-card";
import { cn } from "@/lib/utils";
import type { SerializedCategory } from "@/lib/types";

const ALL_SUB = "__all__";

export function MenuBrowser({ categories }: { categories: SerializedCategory[] }) {
  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? ""
  );
  const [activeSub, setActiveSub] = useState(ALL_SUB);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) ?? categories[0],
    [categories, activeCategoryId]
  );

  function selectCategory(id: string) {
    setActiveCategoryId(id);
    setActiveSub(ALL_SUB);
  }

  if (!activeCategory) return null;

  const visibleItems =
    activeSub === ALL_SUB
      ? activeCategory.menuItems
      : activeCategory.menuItems.filter((i) => i.subcategoryId === activeSub);

  return (
    <div className="space-y-4">
      {/* Barra de categorias */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        {categories.map((cat) => {
          const active = cat.id === activeCategory.id;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={cn(
                "relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border transition-all",
                active
                  ? "border-primary ring-2 ring-primary"
                  : "border-border opacity-80 hover:opacity-100"
              )}
            >
              {cat.coverImageUrl && (
                <Image
                  src={cat.coverImageUrl}
                  alt={cat.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              )}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center text-center text-xs font-medium px-1",
                  active ? "bg-primary/60 text-primary-foreground" : "bg-black/50 text-white"
                )}
              >
                {cat.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Abas de subcategoria */}
      {activeCategory.subcategories.length > 0 && (
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur px-4 py-2 border-b border-border">
          <Tabs value={activeSub} onValueChange={setActiveSub}>
            <TabsList>
              <TabsTrigger value={ALL_SUB}>Todos</TabsTrigger>
              {activeCategory.subcategories.map((sub) => (
                <TabsTrigger key={sub.id} value={sub.id}>
                  {sub.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Grade de itens */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.id + activeSub}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 gap-3 px-4 pb-8 md:grid-cols-2"
        >
          {visibleItems.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              Nenhum item nesta categoria ainda.
            </p>
          )}
          {visibleItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
