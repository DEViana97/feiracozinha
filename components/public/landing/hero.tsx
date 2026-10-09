import Image from "next/image";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-dark-wine px-8 pb-[100px] pt-[110px] text-center">
      {/* Faixa de fotos que desliza para a direita sem parar. As cópias alternam
          normal/espelhada para não aparecer emenda; a animação anda exatamente
          2 fotos (25% de 8) e recomeça, então o laço é invisível. */}
      <div aria-hidden className="absolute inset-y-0 left-0 flex w-max hero-pan">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`aspect-[3/2] h-full shrink-0 bg-cover bg-center ${i % 2 ? "-scale-x-100" : ""}`}
            style={{ backgroundImage: "url('/images/hero-mesa.jpg')" }}
          />
        ))}
      </div>
      {/* Escurece a foto para o texto claro continuar legível */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a100c]/75 via-[#3a100c]/65 to-[#3a100c]/80" />
      <div className="relative mx-auto max-w-[680px]">
        <h1 className="m-0 mb-8 flex justify-center">
          <Image
            src="/images/logo-feira-branco.svg"
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
        <Link
          href="/reservas"
          className="border-b border-[#F1DFC9]/50 pb-[3px] font-sans text-[13.5px] font-semibold text-[#F1DFC9]"
        >
          Reservar mesa
        </Link>
      </div>
    </section>
  );
}
