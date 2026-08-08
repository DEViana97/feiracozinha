"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

// TODO: trocar os `src` pelas fotos reais do espaço assim que a sessão de
// fotografia do restaurante estiver pronta.
const PHOTOS = [
  { key: "salao", src: "/images/ambiente/salao.jpg", alt: "Salão do restaurante" },
  { key: "cozinha-aberta", src: "/images/ambiente/cozinha-aberta.jpg", alt: "Bancada e cozinha aberta" },
  { key: "mesa-posta", src: "/images/ambiente/mesa-posta.jpg", alt: "Mesa posta" },
];

function EnvironmentPhoto({
  src,
  alt,
  failed,
  onError,
  className,
}: {
  src: string;
  alt: string;
  failed: boolean;
  onError: () => void;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[10px] bg-taupe/20 ${className}`}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff className="size-7 text-taupe/50" />
        </div>
      ) : (
        <Image src={src} alt={alt} fill className="object-cover" onError={onError} />
      )}
    </div>
  );
}

export function LandingEnvironment() {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <section id="ambiente" className="mx-auto max-w-[1100px] px-8 pb-[110px]">
      <div className="grid h-[480px] grid-cols-[1.4fr_1fr] grid-rows-2 gap-4">
        <EnvironmentPhoto
          {...PHOTOS[0]}
          failed={!!failed[PHOTOS[0].key]}
          onError={() => setFailed((p) => ({ ...p, [PHOTOS[0].key]: true }))}
          className="row-span-2"
        />
        <EnvironmentPhoto
          {...PHOTOS[1]}
          failed={!!failed[PHOTOS[1].key]}
          onError={() => setFailed((p) => ({ ...p, [PHOTOS[1].key]: true }))}
          className=""
        />
        <EnvironmentPhoto
          {...PHOTOS[2]}
          failed={!!failed[PHOTOS[2].key]}
          onError={() => setFailed((p) => ({ ...p, [PHOTOS[2].key]: true }))}
          className=""
        />
      </div>
      <p className="mt-[22px] text-center font-serif text-[15px] italic text-dark-wine">
        Um ambiente com atmosfera de feira, bodega e mercearia cearense.
      </p>
    </section>
  );
}
