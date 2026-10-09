"use client";

import { useState } from "react";
import { CategoryChips, type CategoryChip } from "./category-chips";
import { SecondarySection, type MenuGroup } from "./secondary-section";
import { useFontZoom } from "./font-zoom-provider";

export type MenuCategoryData = {
  key: string;
  name: string;
  color: string;
  tagline: string;
  coverImageUrl?: string | null;
  groups: MenuGroup[];
};

type MenuViewProps = {
  categories: MenuCategoryData[];
  initialCategory?: string;
};

// Os chips de categoria funcionam como um filtro: só a categoria ativa é
// exibida por vez (não é navegação por âncora/scroll). Dentro dela os itens
// aparecem agrupados por subcategoria (ex.: Drinks > Autorais, Clássicos).
//
// `initialCategory` permite abrir já filtrado numa categoria específica
// (?categoria=<slug>), lido em cardapio/page.tsx e repassado aqui.
export function MenuView({ categories, initialCategory }: MenuViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    (initialCategory && categories.some((c) => c.key === initialCategory)
      ? initialCategory
      : categories[0]?.key) ?? ""
  );
  const { fontScale, setFontScale } = useFontZoom();

  const chips: CategoryChip[] = categories.map((c) => ({
    key: c.key,
    name: c.name,
    color: c.color,
    coverImageUrl: c.coverImageUrl,
  }));

  const activeSection = categories.find((c) => c.key === activeCategory) ?? categories[0];

  return (
    <div>
      {categories.length > 0 && (
        <CategoryChips
          categories={chips}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          fontScale={fontScale}
          onFontScaleChange={setFontScale}
        />
      )}

      {activeSection && (
        <SecondarySection
          key={activeSection.key}
          name={activeSection.name}
          color={activeSection.color}
          tagline={activeSection.tagline}
          groups={activeSection.groups}
        />
      )}
    </div>
  );
}
