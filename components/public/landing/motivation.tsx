import Image from "next/image";

export function LandingMotivation() {
  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-16 px-8 pb-[100px] pt-[60px] md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h2 className="m-0 mb-[22px] font-serif text-[28px] font-medium text-espresso">
          Por que a Feira existe
        </h2>
        <p className="mb-[18px] text-[15.5px] leading-[1.85] text-taupe">
          A Feira nasce de uma percepção simples e incômoda: os ingredientes
          do Ceará — a carne de sol, a macaxeira, o queijo coalho, o peixe
          da manhã — são tratados como cotidianos demais para sustentar uma
          cozinha de alto padrão. Como se precisassem de outro sotaque para
          merecer atenção.
        </p>
        <p className="m-0 text-[15.5px] leading-[1.85] text-taupe">
          Não precisam. A Feira parte do Ceará como território alimentar —
          não como tema, não como decoração. O que muda é a técnica, o
          cuidado e o contexto em que esse ingrediente é servido. A origem
          permanece intacta.
        </p>
      </div>

      <div className="relative mx-auto aspect-4/3 w-full max-w-105 overflow-hidden rounded-[10px]">
        <Image
          src="/images/feira-why.jpg"
          alt="Ingredientes cearenses usados na cozinha da Feira"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}
