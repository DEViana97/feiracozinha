import Image from "next/image";
import Link from "next/link";
import { PhotoStrip } from "@/components/public/landing/photo-strip";

export function LandingHero({ reservationsEnabled = true }: { reservationsEnabled?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-dark-wine px-8 pb-[100px] pt-[110px] text-center">
      <PhotoStrip />
      <div className="relative mx-auto max-w-[680px]">
        <h1 className="m-0 mb-8 flex justify-center">
          <Image
            src="/images/logo-feira-branco-cobogo.svg"
            alt="Feira, Cozinha e Mesa"
            width={676}
            height={434}
            priority
            className="h-auto w-[300px] max-w-full"
          />
        </h1>
        <p className="mb-[34px] font-serif text-2xl italic leading-[1.4] text-[#F1DFC9]">
          Cozinha, mesa e território cearense.
        </p>
        {reservationsEnabled && (
          <Link
            href="/reservas"
            className="border-b border-[#F1DFC9]/50 pb-[3px] font-sans text-[13.5px] font-semibold text-[#F1DFC9]"
          >
            Reservar mesa
          </Link>
        )}
      </div>
    </section>
  );
}
