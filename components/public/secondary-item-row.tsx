import Image from "next/image";

export type SecondaryMenuItem = {
  name: string;
  description: string;
  price: string;
  imageUrl?: string | null;
  isNew?: boolean;
};

type SecondaryItemRowProps = {
  item: SecondaryMenuItem;
};

// Linha usada em Da Adega, Bebidas e Sobremesas, seções mais enxutas que
// ficam sobre fundo levemente diferente (#F5ECDD no mockup). Thumbnail
// aparece só quando o item tem imagem cadastrada.
export function SecondaryItemRow({ item }: SecondaryItemRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/[0.08] pb-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        {item.imageUrl && (
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
            <Image src={item.imageUrl} alt={item.name} fill sizes="36px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="m-0 font-serif text-[15px] text-[#3B2A26]">{item.name}</h3>
            {item.isNew && (
              <span className="shrink-0 rounded-full bg-copperwood px-1.5 py-px text-[9px] font-semibold uppercase tracking-[1px] text-floral-white">
                Novidade
              </span>
            )}
          </div>
          <p className="mt-[3px] text-xs text-[#5A4E45]">{item.description}</p>
        </div>
      </div>
      <span className="whitespace-nowrap text-[13px] font-semibold text-dark-wine">
        {item.price}
      </span>
    </div>
  );
}
