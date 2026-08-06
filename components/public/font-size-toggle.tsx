"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SCALES = ["sm", "md", "lg", "xl"] as const;
type Scale = (typeof SCALES)[number];
const STORAGE_KEY = "feira-font-scale";

export function FontSizeToggle() {
  const [scale, setScale] = useState<Scale>("md");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Scale | null;
    if (saved && SCALES.includes(saved)) {
      setScale(saved);
      document.documentElement.dataset.fontScale = saved;
    }
  }, []);

  function cycle() {
    const idx = SCALES.indexOf(scale);
    const next = SCALES[(idx + 1) % SCALES.length];
    setScale(next);
    document.documentElement.dataset.fontScale = next;
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label="Ajustar tamanho da fonte"
      title="Ajustar tamanho da fonte"
      className="font-serif text-sm"
    >
      Aa
    </Button>
  );
}
