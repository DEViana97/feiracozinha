"use client";

import { useState } from "react";
import { CategoryChips, type CategoryChip } from "./category-chips";
import { TerritorySection } from "./territory-section";
import { SecondarySection } from "./secondary-section";
import { useFontZoom } from "./font-zoom-provider";
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

// Os chips de categoria funcionam como um filtro: só a seção território
// ativa é exibida por vez (não é navegação por âncora/scroll). As seções
// secundárias (Adega/Bebidas/Sobremesas) ficam sempre visíveis abaixo,
// depois do divisor de cobogó — ver Cardápio Feira, Cozinha e Mesa.dc.html.
export function MenuView({ territoryCategories, secondaryCategories }: MenuViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    territoryCategories[0]?.key ?? ""
  );
  const { fontScale, setFontScale } = useFontZoom();

  const chips: CategoryChip[] = territoryCategories.map((c) => ({
    key: c.key,
    name: c.name,
    color: c.color,
  }));

  const activeSection =
    territoryCategories.find((c) => c.key === activeCategory) ??
    territoryCategories[0];

  return (
    <div>
      {territoryCategories.length > 0 && (
        <CategoryChips
          categories={chips}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          fontScale={fontScale}
          onFontScaleChange={setFontScale}
        />
      )}

      {activeSection && (
        <TerritorySection
          categoryKey={activeSection.key}
          name={activeSection.name}
          color={activeSection.color}
          tagline={activeSection.tagline}
          items={activeSection.items}
        />
      )}

      {/* Divisor de cobogó entre seções principais e secundárias */}
      <div className="relative h-9 overflow-hidden opacity-30">
        <div
          className="absolute inset-0 bg-dark-wine"
          style={{
            WebkitMaskImage: "url('/images/cobogo.png')",
            maskImage: "url('/images/cobogo.png')",
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
