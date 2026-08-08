"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { buildWhatsappUrl, buildInstagramUrl } from "@/components/public/menu-footer";

// TODO: horário de funcionamento — não existe campo no RestaurantInfo hoje,
// confirmar com o Fernando e cadastrar em /admin/settings (ou adicionar o
// campo ao model) quando definido. Endereço/WhatsApp/Instagram já vêm do
// banco (mesmos dados usados no rodapé do cardápio).
const HOURS = "Terça a domingo, 12h às 23h";

export type LandingLocationInfo = {
  address: string | null;
  phone: string | null;
  instagram: string | null;
};

export function LandingLocation({ info }: { info: LandingLocationInfo }) {
  const [mapFailed, setMapFailed] = useState(false);

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 px-8 py-[90px] md:grid-cols-2">
      <div>
        <h2 className="m-0 mb-5 font-serif text-[30px] font-medium text-espresso">
          Localização e horário
        </h2>
        {info.address && (
          <p className="mb-2 text-[14.5px] leading-[1.7] text-taupe">{info.address}</p>
        )}
        <p className="mb-5 text-[14.5px] leading-[1.7] text-taupe">{HOURS}</p>
        <div className="flex flex-col gap-1.5 text-[14.5px]">
          {info.phone && (
            <a
              href={buildWhatsappUrl(info.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-wine"
            >
              WhatsApp {info.phone}
            </a>
          )}
          {info.instagram && (
            <a
              href={buildInstagramUrl(info.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-wine"
            >
              {info.instagram}
            </a>
          )}
        </div>
      </div>

      <div className="relative h-80 w-full overflow-hidden rounded-[10px] bg-taupe/20">
        {mapFailed ? (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="size-7 text-taupe/50" />
          </div>
        ) : (
          <Image
            src="/images/mapa-placeholder.jpg"
            alt="Mapa de localização"
            fill
            className="object-cover"
            onError={() => setMapFailed(true)}
          />
        )}
      </div>
    </section>
  );
}
