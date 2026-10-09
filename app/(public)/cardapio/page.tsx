import { getCategoriesWithItems, getIdentitySlides, getRestaurantInfo } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { MenuHeader } from "@/components/public/menu-header";
import { IdentityCarousel } from "@/components/public/identity-carousel";
import { MenuView, type MenuCategoryData } from "@/components/public/menu-view";
import { MenuFooter } from "@/components/public/menu-footer";
import { FontZoomProvider } from "@/components/public/font-zoom-provider";
import {
  CATEGORY_BRAND_CONFIG,
  DEFAULT_CATEGORY_COLOR,
} from "@/components/public/category-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CardapioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [categories, slides, restaurantInfo] = await Promise.all([
    getCategoriesWithItems(),
    getIdentitySlides(),
    getRestaurantInfo(),
  ]);

  // Cada categoria vira uma aba; dentro dela os itens são agrupados pela
  // subcategoria (na ordem cadastrada). Itens sem subcategoria vêm primeiro.
  const menuCategories: MenuCategoryData[] = categories
    .filter((c) => c.menuItems.length > 0)
    .map((c) => {
      const brand = CATEGORY_BRAND_CONFIG[c.slug];
      const toRow = (item: (typeof c.menuItems)[number]) => ({
        name: item.name,
        description: item.description,
        price: formatPrice(item.basePrice),
        imageUrl: item.imageUrl,
        isNew: item.featured,
      });

      const groups: MenuCategoryData["groups"] = [];
      const loose = c.menuItems.filter((i) => !i.subcategoryId);
      if (loose.length > 0) groups.push({ items: loose.map(toRow) });
      for (const sub of c.subcategories) {
        const items = c.menuItems.filter((i) => i.subcategoryId === sub.id);
        if (items.length > 0) groups.push({ title: sub.name, items: items.map(toRow) });
      }

      return {
        key: c.slug,
        name: c.name,
        color: brand?.color ?? DEFAULT_CATEGORY_COLOR,
        tagline: brand?.tagline ?? "",
        coverImageUrl: c.coverImageUrl,
        groups,
      };
    });

  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <FontZoomProvider>
          <MenuHeader />

          <section className="relative overflow-hidden px-6 pb-[30px] pt-9">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/cobogo-cream.jpg')",
                backgroundSize: "140px auto",
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
              }}
            />
            <div className="relative">
              <h1 className="m-0 font-serif text-[30px] font-medium leading-tight text-espresso">
                Cozinha, mesa e território cearense.
              </h1>
              <p className="mt-3 font-serif text-[15px] italic text-dark-wine">
                A origem do Ceará no centro da mesa.
              </p>
            </div>
          </section>

          <IdentityCarousel
            slides={slides.map((s) => ({
              id: s.id,
              imageUrl: s.imageUrl,
              caption: s.caption,
            }))}
          />

          <MenuView categories={menuCategories} initialCategory={categoria} />

          <MenuFooter
            info={{
              name: restaurantInfo.name,
              tagline: restaurantInfo.tagline,
              address: restaurantInfo.address,
              phone: restaurantInfo.phone,
              instagram: restaurantInfo.instagram,
            }}
          />
        </FontZoomProvider>
      </div>
    </div>
  );
}
