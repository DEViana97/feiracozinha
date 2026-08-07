// Cores alinhadas ao que já está definido no cardápio (Component.CATEGORY_DEFS).
// Se mudar a cor de uma categoria lá, espelhar aqui também — idealmente isso
// vira uma fonte única compartilhada (ver observação no final do pacote).
const CATEGORIES = [
  { name: "Do Sertão", color: "#6E2721" },
  { name: "Da Serra", color: "#54573D" },
  { name: "Do Mar", color: "#3B4F54" },
];

export function LinktreeCategoryPreview() {
  return (
    <section className="py-[22px]">
      <div className="px-5 pb-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-[2.5px] text-olive-wood">
          Explore o cardápio
        </span>
      </div>
      <div className="feira-cat-scroll flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="flex-[0_0_128px] rounded-[10px] border border-black/[0.07] bg-[#FFFDF9] px-3.5 py-[18px] text-center"
          >
            <span
              className="mb-2.5 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <div
              className="font-serif text-[15px]"
              style={{ color: cat.color }}
            >
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
