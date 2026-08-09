import Image from "next/image";
import { CATEGORY_ICONS, type CategoryIconKey } from "./category-icons";

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  originLabel: string;
  imageUrl?: string | null;
  isNew?: boolean;
};

type MenuItemCardProps = {
  item: MenuItem;
  categoryKey: CategoryIconKey;
  color: string;
};

// Círculo com foto do prato quando disponível; cai pro ícone da categoria
// quando o item ainda não tem imagem cadastrada.
export function MenuItemCard({ item, categoryKey, color }: MenuItemCardProps) {
  const Icon = CATEGORY_ICONS[categoryKey];

  return (
    <div className="flex gap-4 rounded-md border border-black/[0.07] bg-[#FFFDF9] p-3.5">
      <div
        className="relative flex h-[106px] w-[106px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor: `${color}1A` /* ~10% opacity */ }}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="106px"
            className="object-cover"
          />
        ) : (
          <Icon color={color} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="m-0 font-serif text-[15px] leading-tight text-[#3B2A26]">
            {item.name}
          </h3>
          {item.isNew && (
            <span className="shrink-0 rounded-full bg-copperwood px-1.5 py-px text-[9px] font-semibold uppercase tracking-[1px] text-floral-white">
              Novidade
            </span>
          )}
        </div>
        <p className="mb-2 mt-1 text-[11.5px] leading-relaxed text-[#5A4E45]">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-[10.5px] font-semibold uppercase tracking-[1.5px]"
            style={{ color }}
          >
            {item.originLabel}
          </span>
          <span className="text-sm font-semibold text-dark-wine">
            {item.price}
          </span>
        </div>
      </div>
    </div>
  );
}
