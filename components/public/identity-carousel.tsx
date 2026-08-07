"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ImageOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// TODO: trocar `src` por fotos reais quando a sessão de fotografia
// do restaurante estiver pronta. Por ora aponta para placeholders.
const SLIDES = [
  {
    id: "carousel-1",
    src: "/images/carousel/banca-da-feira.jpg",
    placeholder: "Foto: banca da feira",
    caption: "Direto da feira",
  },
  {
    id: "carousel-2",
    src: "/images/carousel/produtor-local.jpg",
    placeholder: "Foto: produtor local",
    caption: "Produtores locais",
  },
  {
    id: "carousel-3",
    src: "/images/carousel/ingrediente-cru.jpg",
    placeholder: "Foto: ingrediente cru da estação",
    caption: "Território cearense",
  },
  {
    id: "carousel-4",
    src: "/images/carousel/colheita-do-dia.jpg",
    placeholder: "Foto: colheita do dia",
    caption: "Ingredientes da estação",
  },
  {
    id: "carousel-5",
    src: "/images/carousel/terra-a-mesa.jpg",
    placeholder: "Foto: caminho da terra à mesa",
    caption: "Da terra à mesa",
  },
];

export function IdentityCarousel() {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay.current]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedSlides, setFailedSlides] = useState<Record<string, boolean>>({});

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative py-4 pb-[22px]">
      <CobogoDivider className="mb-3.5" />

      <div className="overflow-hidden px-5" ref={emblaRef}>
        <div className="flex gap-3.5">
          {SLIDES.map((slide) => (
            <div key={slide.id} className="flex-[0_0_85%]">
              <div className="relative h-[210px] w-full overflow-hidden rounded-[10px] bg-taupe/20">
                {failedSlides[slide.id] ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                    <ImageOff className="size-7 text-taupe/50" />
                    <span className="text-xs text-taupe/60">{slide.placeholder}</span>
                  </div>
                ) : (
                  <Image
                    src={slide.src}
                    alt={slide.caption}
                    fill
                    className="object-cover"
                    sizes="85vw"
                    onError={() =>
                      setFailedSlides((prev) => ({ ...prev, [slide.id]: true }))
                    }
                  />
                )}
              </div>
              <p className="mt-2.5 text-center font-serif text-sm italic text-dark-wine">
                {slide.caption}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3.5 flex justify-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            aria-label={`Ir para foto ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className="h-[7px] rounded-full transition-all"
            style={{
              width: i === selectedIndex ? 18 : 7,
              backgroundColor: i === selectedIndex ? "#6E2721" : "#D8C6B8",
            }}
          />
        ))}
      </div>

      <CobogoDivider className="mt-3.5" />
    </section>
  );
}

function CobogoDivider({ className }: { className?: string }) {
  return (
    <div className={`relative h-3.5 overflow-hidden ${className ?? ""}`}>
      <div
        className="absolute inset-0 bg-dark-wine opacity-25"
        style={{
          WebkitMaskImage: "url('/images/cobogo.png')",
          maskImage: "url('/images/cobogo.png')",
          WebkitMaskSize: "90px",
          maskSize: "90px",
          WebkitMaskRepeat: "repeat",
          maskRepeat: "repeat",
        }}
      />
    </div>
  );
}
