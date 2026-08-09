"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type CategoryChip = {
  key: string;
  name: string;
  color: string;
  coverImageUrl?: string | null;
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
  const a11yRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!a11yOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (a11yRef.current && !a11yRef.current.contains(e.target as Node)) {
        setA11yOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setA11yOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [a11yOpen]);

  return (
    <div className="flex items-center gap-2 py-4 pl-5 pr-[18px]">
      <div className="flex min-w-0 flex-1 gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = cat.key === activeCategory;
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className="relative h-12 w-36 shrink-0 overflow-hidden rounded-2xl transition-all"
              style={{
                outline: isActive ? `2px solid ${cat.color}` : "2px solid transparent",
                outlineOffset: "2px",
              }}
            >
              {cat.coverImageUrl ? (
                <Image
                  src={cat.coverImageUrl}
                  alt=""
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: cat.color }}
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? `linear-gradient(0deg, ${cat.color}E6 0%, ${cat.color}66 55%, ${cat.color}33 100%)`
                    : "linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.12) 100%)",
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center px-2 text-center font-sans text-[13px] font-semibold leading-tight text-floral-white">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative flex-shrink-0" ref={a11yRef}>
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
