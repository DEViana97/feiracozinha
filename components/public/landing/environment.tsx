"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

// A fachada vem primeiro (célula grande): numa célula pequena, a foto vertical ficaria ampliada demais.
const PHOTOS = [
  { id: "fachada", src: "/images/feira-fachada.jpg", alt: "Fachada do Feira, com cobogó vermelho e o letreiro", position: "center 45%" },
  { id: "salao", src: "/images/feira-mesas.jpg", alt: "Salão com cadeiras e janelas de vidro para o verde", position: "center 55%" },
  { id: "cozinha-aberta", src: "/images/feira-parede.jpg", alt: "Parede verde com janela para a cozinha", position: "center 22%" },
];

function EnvironmentPhoto({
  src,
  alt,
  failed,
  onError,
  className,
  sizes,
  position,
}: {
  src: string;
  alt: string;
  failed: boolean;
  onError: () => void;
  className: string;
  sizes: string;
  position?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[10px] bg-taupe/20 ${className}`}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff className="size-7 text-taupe/50" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: position }}
          onError={onError}
        />
      )}
    </div>
  );
}

export function LandingEnvironment() {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <section id="ambiente" className="mx-auto max-w-[1100px] px-8 pb-[110px]">
      <div className="grid h-[580px] grid-cols-[1.4fr_1fr] grid-rows-[1.35fr_1fr] gap-4">
        <EnvironmentPhoto
          key={PHOTOS[0].id}
          {...PHOTOS[0]}
          failed={!!failed[PHOTOS[0].id]}
          onError={() => setFailed((p) => ({ ...p, [PHOTOS[0].id]: true }))}
          className="row-span-2"
          sizes="(max-width: 1100px) 58vw, 604px"
        />
        <EnvironmentPhoto
          key={PHOTOS[1].id}
          {...PHOTOS[1]}
          failed={!!failed[PHOTOS[1].id]}
          onError={() => setFailed((p) => ({ ...p, [PHOTOS[1].id]: true }))}
          className=""
          sizes="(max-width: 1100px) 42vw, 432px"
        />
        <EnvironmentPhoto
          key={PHOTOS[2].id}
          {...PHOTOS[2]}
          failed={!!failed[PHOTOS[2].id]}
          onError={() => setFailed((p) => ({ ...p, [PHOTOS[2].id]: true }))}
          className=""
          sizes="(max-width: 1100px) 42vw, 432px"
        />
      </div>
      <p className="mt-[22px] text-center font-serif text-[15px] italic text-dark-wine">
        Um ambiente com atmosfera de feira, bodega e mercearia cearense.
      </p>
    </section>
  );
}
