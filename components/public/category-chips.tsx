"use client";

import { useState } from "react";

export type CategoryChip = {
  key: string;
  name: string;
  color: string;
};

type CategoryChipsProps = {
  categories: CategoryChip[];
  activeCategory: string;
  onSelect: (key: string) => void;
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
};

const FONT_SCALE_STEP = 0.1;
const FONT_SCALE_MIN = 0.8;
const FONT_SCALE_MAX = 1.5;

export function CategoryChips({
  categories,
  activeCategory,
  onSelect,
  fontScale,
  onFontScaleChange,
}: CategoryChipsProps) {
  const [a11yOpen, setA11yOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 py-4 pl-5 pr-[18px]">
      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className="flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: isActive ? cat.color : "transparent",
                color: isActive ? "#FCF5EB" : cat.color,
                border: `1px solid ${cat.color}`,
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setA11yOpen((v) => !v)}
          aria-label="Acessibilidade: ajustar tamanho da fonte"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-dark-wine font-serif text-[15px] font-semibold text-dark-wine"
        >
          A
        </button>

        {a11yOpen && (
          <div className="absolute right-0 top-11 z-30 flex gap-1.5 rounded-[10px] bg-espresso p-2 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
            <button
              onClick={() =>
                onFontScaleChange(Math.max(FONT_SCALE_MIN, +(fontScale - FONT_SCALE_STEP).toFixed(2)))
              }
              aria-label="Diminuir fonte"
              className="h-9 w-9 rounded-lg bg-floral-white font-sans text-[13px] font-bold text-dark-wine"
            >
              A-
            </button>
            <button
              onClick={() => onFontScaleChange(1)}
              aria-label="Tamanho padrão"
              className="h-9 w-9 rounded-lg bg-floral-white font-sans text-[11px] font-bold text-dark-wine"
            >
              100%
            </button>
            <button
              onClick={() =>
                onFontScaleChange(Math.min(FONT_SCALE_MAX, +(fontScale + FONT_SCALE_STEP).toFixed(2)))
              }
              aria-label="Aumentar fonte"
              className="h-9 w-9 rounded-lg bg-floral-white font-sans text-[15px] font-bold text-dark-wine"
            >
              A+
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
