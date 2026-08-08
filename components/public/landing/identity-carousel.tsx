"use client";

// Mesma lógica e mesmos slides do IdentityCarousel já usado em /cardapio
// (components/public/identity-carousel.tsx), só que com cards de largura
// fixa (340px) em vez de 85% — layout pensado pra tela grande. Se preferir
// evitar duplicação, dá pra extrair um componente base compartilhado com
// uma prop `cardWidth`; deixei separado aqui pra não arriscar quebrar o
// carrossel do cardápio que você já validou.

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ImageOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type LandingIdentitySlideData = {
  id: string;
  imageUrl: string;
  caption: string;
};

export function LandingIdentityCarousel({
  slides,
}: {
  slides: LandingIdentitySlideData[];
}) {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
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

  if (slides.length === 0) return null;

  return (
    <section className="pb-[100px]">
      <div className="mx-auto max-w-[1100px]">
        <CobogoDivider />

        <div className="overflow-hidden px-8" ref={emblaRef}>
          <div className="flex gap-5">
            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_340px]">
                <div className="relative h-[260px] w-full overflow-hidden rounded-[10px] bg-taupe/20">
                  {failedSlides[slide.id] ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                      <ImageOff className="size-7 text-taupe/50" />
                      <span className="text-xs text-taupe/60">{slide.caption}</span>
                    </div>
                  ) : (
                    <Image
                      src={slide.imageUrl}
                      alt={slide.caption}
                      fill
                      className="object-cover"
                      sizes="340px"
                      onError={() =>
                        setFailedSlides((prev) => ({ ...prev, [slide.id]: true }))
                      }
                    />
                  )}
                </div>
                <p className="mt-3 text-center font-serif text-[15px] italic text-dark-wine">
                  {slide.caption}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[18px] flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              aria-label={`Ir para a foto ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="h-[7px] rounded-full transition-all"
              style={{
                width: i === selectedIndex ? 18 : 7,
                backgroundColor: i === selectedIndex ? "#6E2721" : "#D8C6B8",
              }}
            />
          ))}
        </div>

        <CobogoDivider />
      </div>
    </section>
  );
}

function CobogoDivider() {
  return (
    <div className="relative mb-[26px] h-3.5 overflow-hidden">
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
