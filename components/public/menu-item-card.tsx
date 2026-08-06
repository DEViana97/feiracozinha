import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getTagIcon } from "@/lib/tag-icons";
import type { SerializedMenuItem } from "@/lib/types";

export function MenuItemCard({ item }: { item: SerializedMenuItem }) {
  const hasVariants = item.variants.length > 0;
  const priceLabel = hasVariants
    ? `A partir de ${formatPrice(item.variants[0].price)}`
    : formatPrice(item.basePrice);

  return (
    <Link
      href={`/item/${item.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50"
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {item.featured && (
          <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
            Destaque
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {item.tags.slice(0, 4).map((tag) => {
              const Icon = getTagIcon(tag.icon);
              return (
                <span key={tag.id} title={tag.name} className="text-muted-foreground">
                  <Icon className="size-3.5" />
                </span>
              );
            })}
          </div>
          <span className="shrink-0 text-sm font-medium text-primary">
            {priceLabel}
          </span>
        </div>

        <span className="mt-1 text-xs font-medium text-primary underline-offset-2 group-hover:underline">
          Saiba mais
        </span>
      </div>
    </Link>
  );
}
