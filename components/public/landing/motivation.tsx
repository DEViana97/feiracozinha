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

      <svg viewBox="0 0 200 240" className="mx-auto w-full max-w-[280px]">
        <g fill="none" stroke="#AF6B10" strokeWidth="1.3">
          <path d="M100 220c-30-25-55-60-55-95a55 55 0 0 1 110 0c0 35-25 70-55 95Z" />
          <path d="M100 220V90" />
          <path d="M100 150c-18-10-30-8-42 2" />
          <path d="M100 120c18-10 30-8 42 2" />
          <path d="M100 95c-14-8-24-6-34 3" />
        </g>
      </svg>
    </section>
  );
}
