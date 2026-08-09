import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getItemBySlug } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
// Tags temporariamente desativado — ver nota em AGENTS.md.
// import { getTagIcon } from "@/lib/tag-icons";
import { FontSizeToggle } from "@/components/public/font-size-toggle";
import { ShareButton } from "@/components/public/share-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item || !item.active) notFound();

  // Variações temporariamente desativado — ver nota em AGENTS.md.
  // const hasVariants = item.variants.length > 0;

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          href="/cardapio"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-1">
          <FontSizeToggle />
          <ShareButton title={item.name} text={item.description} />
        </div>
      </div>

      {item.imageUrl && (
        <div className="relative mx-4 aspect-[4/3] overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9]">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-3xl">{item.name}</h1>
          {item.featured && (
            <span className="shrink-0 rounded-full bg-copperwood px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[1px] text-floral-white">
              Novidade
            </span>
          )}
        </div>
        <p className="mt-1 text-lg text-primary font-medium">
          {/* Variações temporariamente desativado — ver nota em AGENTS.md.
          hasVariants
            ? `A partir de ${formatPrice(item.variants[0].price)}`
            : */ formatPrice(item.basePrice)}
        </p>

        {/* Tags temporariamente desativado — ver nota em AGENTS.md.
        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {item.tags.map(({ tag }) => {
              const Icon = getTagIcon(tag.icon);
              return (
                <span
                  key={tag.id}
                  className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  <Icon className="size-3.5" />
                  {tag.name}
                </span>
              );
            })}
          </div>
        )}
        */}

        <p className="mt-4 leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {/* Variações temporariamente desativado — ver nota em AGENTS.md.
        {hasVariants && (
          <div className="mt-6 space-y-3">
            <h2 className="font-serif text-xl">Variações</h2>
            {item.variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
              >
                {variant.imageUrl && (
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={variant.imageUrl}
                      alt={variant.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{variant.name}</p>
                  {variant.description && (
                    <p className="text-sm text-muted-foreground">
                      {variant.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-medium text-primary">
                  {formatPrice(variant.price)}
                </span>
              </div>
            ))}
          </div>
        )}
        */}
      </div>
    </div>
  );
}
