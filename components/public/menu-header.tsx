"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Header fixo (sticky) usado tanto na página do cardápio quanto na de reserva.
// No mockup original do Claude Design, cardápio e reserva eram uma única
// página com state interno (view: 'menu' | 'reservation'). Aqui, como o
// projeto usa rotas reais (/cardapio e /reservas), a view é detectada pela
// URL — não precisa passar prop nem duplicar state.
export function MenuHeader() {
  const pathname = usePathname();
  const isReservationView = pathname?.startsWith("/reservas");
  return (
    <header className="sticky top-0 z-20 border-b border-dark-wine/[0.15] bg-floral-white">
      <div className="flex items-center justify-between px-[18px] py-4">
        {isReservationView ? (
          <Link
            href="/cardapio"
            className="flex items-center gap-1.5 py-1.5 font-sans text-sm font-semibold text-dark-wine"
          >
            ← Cardápio
          </Link>
        ) : (
          <span className="w-[70px]" />
        )}

        <div className="flex items-center gap-1">
          <Image src="/images/cobogo-mark.png" alt="" width={22} height={22} className="h-[22px] w-auto" />
          <span className="font-serif text-xl tracking-[2px] text-dark-wine">
            FEIRA
          </span>
        </div>

        {!isReservationView ? (
          <Link
            href="/reservas"
            className="rounded-full bg-dark-wine px-3.5 py-2 font-sans text-[13px] font-semibold text-floral-white"
          >
            Reservar
          </Link>
        ) : (
          <span className="w-[70px]" />
        )}
      </div>
      <div className="pb-2.5 text-center font-sans text-[11px] uppercase tracking-[3px] text-olive-wood">
        Cozinha e Mesa
      </div>
    </header>
  );
}
