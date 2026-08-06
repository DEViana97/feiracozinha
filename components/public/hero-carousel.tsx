"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroCarousel({ images }: { images: { url: string; alt: string }[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%] aspect-[4/3] sm:aspect-[16/7]">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/30" />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur hover:bg-background/80"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            aria-label="Próximo"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur hover:bg-background/80"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir para imagem ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === selectedIndex
                    ? "bg-primary"
                    : "bg-foreground/40 hover:bg-foreground/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
