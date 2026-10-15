import { MotivationSlideshow } from "@/components/public/landing/motivation-slideshow";

export function LandingMotivation() {
  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-16 px-8 pb-[100px] pt-[60px] md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h2 className="m-0 mb-[22px] font-serif text-[28px] font-medium text-espresso">
          Por que o Feira existe
        </h2>
        <p className="mb-[18px] text-[15.5px] leading-[1.85] text-taupe">
          O Feira existe porque acreditamos que um ingrediente nunca é apenas um ingrediente.
          Por trás dele existe uma terra, uma estação, uma pessoa que planta, colhe, pesca, produz ou transforma. Existe conhecimento passado de geração em geração. Existe memória. Existe Ceará.
          Queremos aproximar essas histórias de quem se senta à nossa mesa.
          Por isso, o ingrediente ocupa o centro da nossa cozinha. É a partir dele que pensamos os pratos, construímos combinações e criamos experiências que transitam entre o familiar e o inesperado.
          O Feira existe para valorizar o que é nosso.
        </p>
        <p className="m-0 text-[15.5px] leading-[1.85] text-taupe">
          Não precisam. A Feira parte do Ceará como território alimentar,
          não como tema, não como decoração. O que muda é a técnica, o
          cuidado e o contexto em que esse ingrediente é servido. A origem
          permanece intacta.
        </p>
      </div>

      <MotivationSlideshow />
    </section>
  );
}
