import { SecondaryItemRow, type SecondaryMenuItem } from "./secondary-item-row";

type SecondarySectionProps = {
  name: string;
  color: string;
  tagline: string;
  items: SecondaryMenuItem[];
};

export function SecondarySection({ name, color, tagline, items }: SecondarySectionProps) {
  return (
    <section className="bg-[#F5ECDD] px-5 pb-7 pt-[22px]">
      <div className="mb-1 flex items-baseline gap-2.5">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h2 className="m-0 font-serif text-xl font-medium" style={{ color }}>
          {name}
        </h2>
      </div>
      <p className="mb-3.5 text-[13px] leading-relaxed text-taupe">{tagline}</p>

      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <SecondaryItemRow key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}
