"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/images/feira.jpg", alt: "Tomates, favas e laranjas numa banca de feira cearense" },
  { src: "/images/feira-2.jpg", alt: "Ingredientes numa banca de feira cearense" },
  { src: "/images/feira-3.jpg", alt: "Ingredientes numa banca de feira cearense" },
];

const INTERVAL_MS = 4500;

// Fotos alternando em dissolução (crossfade), em loop. As três ficam montadas e só
// a opacidade muda, então a troca não recarrega imagem.
export function MotivationSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-105 overflow-hidden rounded-[10px]">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
