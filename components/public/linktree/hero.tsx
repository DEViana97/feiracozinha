import Image from "next/image";

// Cabeçalho estilo "perfil": espaço livre no topo do cartão, com a foto de fundo
// aparecendo, e a marca (logo em creme, sem fundo) na base.
export function LinktreeHero() {
  return (
    <section className="pb-0 text-center">
      <div className="relative h-[230px]">
        {/* Logo em creme (#F1DFC9, o tom do texto claro do site), sem fundo, direto sobre a foto. */}
        <Image
          src="/images/logo-feira-creme.svg"
          alt="Feira, Cozinha e Mesa"
          width={676}
          height={434}
          priority
          className="absolute bottom-0 left-1/2 h-auto w-[210px] max-w-none -translate-x-1/2"
        />
      </div>

      {/* Só para leitores de tela e SEO: o nome não aparece na tela. */}
      <h1 className="sr-only">Feira, Cozinha e Mesa</h1>
    </section>
  );
}
