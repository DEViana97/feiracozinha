import Image from "next/image";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-dark-wine px-8 pb-[100px] pt-[110px] text-center">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "url('/images/cobogo.png')",
          backgroundSize: "220px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="relative mx-auto max-w-[680px]">
        <div className="mb-3.5 flex items-center justify-center gap-2">
          <Image src="/images/cobogo-mark2-white.png" alt="" width={21} height={40} className="h-10 w-auto" />
          <h1 className="m-0 font-serif text-[58px] font-medium tracking-[3px] text-floral-white">
            FEIRA
          </h1>
        </div>
        <div className="mb-[26px] text-[13px] uppercase tracking-[4px] text-[#E9D9C6]">
          Cozinha e Mesa
        </div>
        <p className="mb-[34px] font-serif text-2xl italic leading-[1.4] text-[#F1DFC9]">
          Cozinha, mesa e território cearense.
        </p>
        <Link
          href="#reservar"
          className="border-b border-[#F1DFC9]/50 pb-[3px] font-sans text-[13.5px] font-semibold text-[#F1DFC9]"
        >
          Reservar mesa
        </Link>
      </div>
    </section>
  );
}
