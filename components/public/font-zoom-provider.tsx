"use client";

import { createContext, useContext, useState } from "react";

type FontZoomContextValue = {
  fontScale: number;
  setFontScale: (scale: number) => void;
};

const FontZoomContext = createContext<FontZoomContextValue | null>(null);

// Envolve a página inteira (header, hero, carrossel, seções, footer) com o
// zoom de acessibilidade — no mockup original, tudo é uma única view com um
// `style="zoom: {{ fontZoom }}"` no wrapper de mais alto nível.
export function FontZoomProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScale] = useState(1);

  return (
    <FontZoomContext.Provider value={{ fontScale, setFontScale }}>
      <div style={{ zoom: fontScale }}>{children}</div>
    </FontZoomContext.Provider>
  );
}

export function useFontZoom() {
  const ctx = useContext(FontZoomContext);
  if (!ctx) {
    throw new Error("useFontZoom deve ser usado dentro de FontZoomProvider");
  }
  return ctx;
}
