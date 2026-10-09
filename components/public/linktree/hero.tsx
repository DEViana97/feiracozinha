import Image from "next/image";

// Cabeçalho estilo "perfil": banner arredondado com o fundo de cobogó vinho,
// avatar com a marca na base do banner e o nome embaixo.
export function LinktreeHero() {
  return (
    <section className="px-4 pt-4 text-center">
      <div className="relative h-[200px] rounded-[22px] bg-dark-wine">
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden rounded-[22px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/cobogo-wine.jpg')" }}
          />
        </div>

        {/* Avatar: sobrepõe a borda inferior do banner */}
        <div className="absolute -bottom-2 left-1/2 flex h-[124px] w-[124px] -translate-x-1/2 items-center justify-center gap-1 rounded-full bg-floral-white shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
          <Image
            src="/images/cobogo-mark2.png"
            alt=""
            width={12}
            height={24}
            className="h-7 w-auto"
          />
          <span className="font-serif text-[29px] leading-none text-dark-wine">
            FEIRA
          </span>
        </div>
      </div>

      <h1 className="m-0 mt-3.5 pb-6 font-sans text-[28px] font-bold leading-tight text-[#1F1A17]">
        Feira Cozinha
      </h1>
    </section>
  );
}
