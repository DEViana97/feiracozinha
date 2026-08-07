export type SecondaryMenuItem = {
  name: string;
  description: string;
  price: string;
};

type SecondaryItemRowProps = {
  item: SecondaryMenuItem;
};

// Linha sem ícone — usada em Da Adega, Bebidas e Sobremesas, seções mais
// enxutas que ficam sobre fundo levemente diferente (#F5ECDD no mockup).
export function SecondaryItemRow({ item }: SecondaryItemRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-black/[0.08] pb-2.5">
      <div>
        <h3 className="m-0 font-serif text-[15px] text-[#3B2A26]">{item.name}</h3>
        <p className="mt-[3px] text-xs text-[#5A4E45]">{item.description}</p>
      </div>
      <span className="whitespace-nowrap text-[13px] font-semibold text-dark-wine">
        {item.price}
      </span>
    </div>
  );
}
