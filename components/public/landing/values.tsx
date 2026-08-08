const VALUES = [
  {
    title: "Território",
    quote: "A origem do ingrediente é parte da experiência, não um detalhe de rodapé.",
  },
  {
    title: "Produto",
    quote: "Honrar o ingrediente cearense como protagonista da experiência gastronômica.",
  },
  {
    title: "Ancestralidade",
    quote: "Cozinhar com técnicas e saberes que atravessam gerações do território.",
  },
  {
    title: "Hospitalidade",
    quote: "Acolher sem perder refinamento — a mesa como lugar de encontro real.",
  },
];

export function LandingValues() {
  return (
    <section className="mx-auto max-w-[1100px] px-8 pb-[110px]">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        {VALUES.map((value) => (
          <div key={value.title}>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[2px] text-[#AF6B10]">
              {value.title}
            </div>
            <p className="m-0 font-serif text-[15.5px] italic leading-[1.6] text-[#3B2A26]">
              {value.quote}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
