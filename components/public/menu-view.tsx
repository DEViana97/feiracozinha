"use client";

import { useState } from "react";
import { CategoryChips, type CategoryChip } from "./category-chips";
import { TerritorySection } from "./territory-section";
import { SecondarySection } from "./secondary-section";
import type { MenuItem } from "./menu-item-card";
import type { SecondaryMenuItem } from "./secondary-item-row";
import type { CategoryIconKey } from "./category-icons";

export type TerritoryCategoryData = {
  key: CategoryIconKey;
  name: string;
  color: string;
  tagline: string;
  items: MenuItem[];
};

export type SecondaryCategoryData = {
  key: string;
  name: string;
  color: string;
  tagline: string;
  items: SecondaryMenuItem[];
};

type MenuViewProps = {
  territoryCategories: TerritoryCategoryData[];
  secondaryCategories: SecondaryCategoryData[];
};

// Este componente é a "montagem" da página do cardápio. Os dados
// (territoryCategories / secondaryCategories) devem vir do banco via
// lib/queries.ts no Server Component da página — este componente aqui é
// só a camada visual/interativa (client component, por causa do state dos
// chips e do zoom de acessibilidade).
//
// Cor, tagline e ícone de cada categoria não fazem parte do schema do
// Prisma hoje — são decisões de marca. Sugestão: um pequeno arquivo
// `category-config.ts` mapeando o slug/nome da categoria no banco para
// { color, tagline, icon }, mesclado com os itens reais na página.
export function MenuView({ territoryCategories, secondaryCategories }: MenuViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    territoryCategories[0]?.key ?? ""
  );
  const [fontScale, setFontScale] = useState(1);

  const chips: CategoryChip[] = territoryCategories.map((c) => ({
    key: c.key,
    name: c.name,
    color: c.color,
  }));

  function handleSelectCategory(key: string) {
    setActiveCategory(key);
    document.getElementById(`section-${key}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div style={{ zoom: fontScale }}>
      <CategoryChips
        categories={chips}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
      />

      {territoryCategories.map((cat) => (
        <div id={`section-${cat.key}`} key={cat.key}>
          <TerritorySection
            categoryKey={cat.key}
            name={cat.name}
            color={cat.color}
            tagline={cat.tagline}
            items={cat.items}
          />
        </div>
      ))}

      {/* Divisor de cobogó entre seções principais e secundárias */}
      <div
        className="relative h-9 overflow-hidden"
        style={{
          opacity: 0.3,
        }}
      >
        <div
          className="absolute inset-0 bg-dark-wine"
          style={{
            WebkitMaskImage: "url('/images/cobogo-pattern.png')",
            maskImage: "url('/images/cobogo-pattern.png')",
            WebkitMaskSize: "150px",
            maskSize: "150px",
            WebkitMaskRepeat: "repeat",
            maskRepeat: "repeat",
          }}
        />
      </div>

      {secondaryCategories.map((sec) => (
        <SecondarySection
          key={sec.key}
          name={sec.name}
          color={sec.color}
          tagline={sec.tagline}
          items={sec.items}
        />
      ))}
    </div>
  );
}
