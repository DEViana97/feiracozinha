import Image from "next/image";

const ORIGINS = [
  {
    key: "serra",
    image: "/images/ilustracao-serra.png",
    imageAlt: "Desenho de ervas da serra",
    name: "Da Serra",
    color: "#54573D",
    story:
      "Na Ibiapaba e no maciço de Baturité, o clima ameno sustenta hortaliças, queijos e frutas que raramente chegam à mesa fina, tratados como fundo, não como protagonistas. O Feira trabalha direto com pequenos produtores dessas serras, trazendo o queijo coalho, o inhame e as folhas frescas para o centro do prato, na estação e no tempo certos.",
  },
  {
    key: "sertao",
    image: "/images/ilustracao-sertao.png",
    imageAlt: "Desenho de macaxeiras do sertão",
    name: "Do Sertão",
    color: "#51433B",
    story:
      "O sertão ensinou o Ceará a conservar: a carne de sol, a rapadura, o feijão de corda são respostas a um clima difícil, não modismo. Cozinhar com esses ingredientes no Feira é reconhecer um saber que atravessa gerações e servi-lo com a mesma dignidade de qualquer outra tradição culinária do mundo.",
  },
  {
    key: "mar",
    image: "/images/ilustracao-mar.png",
    imageAlt: "Desenho de um peixe do mar",
    name: "Do Mar",
    color: "#3B4F54",
    story:
      "A costa cearense sustenta comunidades de pescadores há séculos. O peixe do dia, o camarão, a lagosta chegam ao Feira pelas mãos de quem conhece a maré, não de intermediários. É um mar de trabalho, não de cenário.",
  },
];

// NOTA: menu-view.tsx não usa mais navegação por âncora/scroll - os chips de
// categoria funcionam como filtro (só uma seção território fica visível por
// vez, ver comentário lá). Por isso o link usa ?categoria=<key> em vez de
// #section-<key>: cardapio/page.tsx lê o query param e repassa como
// `initialCategory` pro MenuView, que já abre com a categoria certa ativa.
export function LandingOrigins() {
  return (
    <section id="origens" className="mx-auto max-w-[1100px] px-8 pb-[100px]">
      <h2 className="m-0 mb-3 text-center font-serif text-[32px] font-medium text-espresso">
        As inspirações
      </h2>
      <p className="mx-auto mb-14 max-w-[520px] text-center text-[15px] text-taupe">
        Mar, serra e sertão não são categorias de cardápio: são territórios que
        atravessam a cozinha do Feira.
      </p>

      <div className="flex flex-col gap-14">
        {ORIGINS.map((origin) => (
          <div
            key={origin.key}
            className="flex flex-col gap-6 border-l-[3px] pl-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10"
            style={{ borderColor: origin.color }}
          >
            <div className="min-w-0">
              <h3
                className="m-0 mb-3 font-serif text-2xl font-medium"
                style={{ color: origin.color }}
              >
                {origin.name}
              </h3>
              <p className="mb-3.5 max-w-[680px] text-[15px] leading-[1.85] text-taupe">
                {origin.story}
              </p>
              <a
                href="/cardapio"
                className="text-[13px] font-semibold opacity-85"
                style={{ color: origin.color }}
              >
                Ver no cardápio →
              </a>
            </div>
            <Image
              src={origin.image}
              alt={origin.imageAlt}
              width={600}
              height={600}
              sizes="(max-width: 640px) 160px, 220px"
              className="h-auto w-[160px] shrink-0 sm:w-[220px]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
