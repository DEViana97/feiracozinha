import Image from "next/image";

// Cabeçalho estilo "perfil": banner de cobogó vinho de ponta a ponta no topo do
// cartão (os cantos arredondados vêm do cartão) e avatar com a marca na base.
export function LinktreeHero() {
  return (
    <section className="pb-0 text-center">
      <div className="relative h-[230px] bg-dark-wine">
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/cobogo-wine.jpg')" }}
          />
        </div>

        {/* Avatar: sobrepõe a borda inferior do banner */}
        <div className="absolute -bottom-2 left-1/2 flex h-[124px] w-[124px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-floral-white shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
          {/* O SVG "claro" é quadrado e já traz fundo creme com respiro; o círculo recorta. */}
          <Image
            src="/images/logo-feira-claro.svg"
            alt="Feira, Cozinha e Mesa"
            width={1080}
            height={1080}
            priority
            className="h-auto w-[156px] max-w-none"
          />
        </div>
      </div>

      {/* Só para leitores de tela e SEO: o nome não aparece na tela. */}
      <h1 className="sr-only">Feira, Cozinha e Mesa</h1>
    </section>
  );
}
