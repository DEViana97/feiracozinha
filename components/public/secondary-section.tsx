import { SecondaryItemRow, type SecondaryMenuItem } from "./secondary-item-row";
import { ItemDetailModal } from "./item-detail-modal";

export type MenuGroup = {
  // Título da subcategoria; ausente para itens sem subcategoria.
  title?: string;
  items: SecondaryMenuItem[];
};

type SecondarySectionProps = {
  name: string;
  color: string;
  tagline: string;
  groups: MenuGroup[];
};

export function SecondarySection({ name, color, tagline, groups }: SecondarySectionProps) {
  return (
    <section className="border-t border-black/[0.06] bg-[#F5ECDD] px-5 pb-7 pt-[22px]">
      <div className="mb-1 flex items-baseline gap-2.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h2 className="m-0 font-serif text-[23px] font-medium" style={{ color }}>
          {name}
        </h2>
      </div>
      {tagline && <p className="mb-3.5 text-[13px] leading-relaxed text-taupe">{tagline}</p>}

      <div className="mt-3.5 flex flex-col gap-6">
        {groups.map((group, i) => (
          <div key={group.title ?? `group-${i}`}>
            {group.title && (
              <h3 className="mb-3 mt-0 text-[11.5px] font-semibold uppercase tracking-[1.5px] text-taupe">
                {group.title}
              </h3>
            )}
            <div className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <ItemDetailModal key={item.name} item={item}>
                  <SecondaryItemRow item={item} />
                </ItemDetailModal>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-[13px] text-taupe">Nenhum item disponível no momento.</p>
        )}
      </div>
    </section>
  );
}
