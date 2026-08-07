import Image from "next/image";

export function LinktreeHero() {
  return (
    <section className="relative overflow-hidden bg-dark-wine px-6 pb-9 pt-11 text-center">
      {/* Padrão de cobogó como textura de fundo */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "url('/images/cobogo.png')",
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative">
        {/* Avatar */}
        <div className="mx-auto mb-4 flex h-[76px] w-[76px] items-center justify-center gap-0.5 rounded-full bg-floral-white">
          <Image src="/images/cobogo-mark2.png" alt="" width={16} height={16} className="h-4 w-auto" />
          <span className="font-serif text-[17px] tracking-wide text-dark-wine">
            FEIRA
          </span>
        </div>

        {/* Logotipo principal */}
        <div className="flex items-center justify-center gap-1">
          <Image src="/images/cobogo-mark2-white.png" alt="" width={34} height={34} className="h-[34px] w-auto" />
          <h1 className="m-0 font-serif text-[38px] font-medium tracking-[3px] text-floral-white">
            FEIRA
          </h1>
        </div>

        <div className="mt-2 text-[11.5px] uppercase tracking-[3.5px] text-[#E9D9C6]">
          Cozinha e Mesa
        </div>

        <p className="mt-4 font-serif text-[14.5px] italic text-[#F1DFC9]">
          A origem do Ceará no centro da mesa.
        </p>
      </div>
    </section>
  );
}
