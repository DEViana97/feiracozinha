"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

const PHOTOS = [
  { id: "salao", src: "/images/ambiente-1.jpg", alt: "Salão do restaurante" },
  { id: "cozinha-aberta", src: "/images/ambiente-3.jpg", alt: "Bancada e cozinha aberta" },
  { id: "mesa-posta", src: "/images/ambiente-2.jpg", alt: "Mesa posta" },
];

function EnvironmentPhoto({
  src,
  alt,
  failed,
  onError,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  failed: boolean;
  onError: () => void;
  className: string;
  sizes: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[10px] bg-taupe/20 ${className}`}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff className="size-7 text-taupe/50" />
        </div>
      ) : (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" onError={onError} />
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
