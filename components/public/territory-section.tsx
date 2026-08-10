import { MenuItemCard, type MenuItem } from "./menu-item-card";
import { ItemDetailModal } from "./item-detail-modal";
import type { CategoryIconKey } from "./category-icons";

type TerritorySectionProps = {
  categoryKey: CategoryIconKey;
  name: string;
  color: string;
  tagline: string;
  items: MenuItem[];
};

export function TerritorySection({
  categoryKey,
  name,
  color,
  tagline,
  items,
}: TerritorySectionProps) {
  return (
    <section className="border-t border-black/[0.06] px-5 pb-7 pt-[22px]">
      <div className="mb-1 flex items-baseline gap-2.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h2 className="m-0 font-serif text-[23px] font-medium" style={{ color }}>
          {name}
        </h2>
      </div>
      <p className="mb-4 text-[13px] leading-relaxed text-taupe">{tagline}</p>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <ItemDetailModal key={item.name} item={item}>
            <MenuItemCard item={item} categoryKey={categoryKey} color={color} />
          </ItemDetailModal>
        ))}
      </div>
    </section>
  );
}
