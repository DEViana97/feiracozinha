import { getCategoriesWithItems, getIdentitySlides } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { MenuHeader } from "@/components/public/menu-header";
import { IdentityCarousel } from "@/components/public/identity-carousel";
import {
  MenuView,
  type TerritoryCategoryData,
  type SecondaryCategoryData,
} from "@/components/public/menu-view";
import { MenuFooter } from "@/components/public/menu-footer";
import { FontZoomProvider } from "@/components/public/font-zoom-provider";
import { CATEGORY_BRAND_CONFIG } from "@/components/public/category-config";
import type { CategoryIconKey } from "@/components/public/category-icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Categorias "território" (com ícone e card grande) — as demais viram
// seção secundária (lista simples). Ver Cardápio Feira, Cozinha e
// Mesa.dc.html / Component.CATEGORY_DEFS.
const TERRITORY_KEYS: CategoryIconKey[] = ["serra", "sertao", "mar"];

export default async function CardapioPage() {
  const [categories, slides] = await Promise.all([
    getCategoriesWithItems(),
    getIdentitySlides(),
  ]);

  const territoryCategories: TerritoryCategoryData[] = categories
    .filter((c): c is typeof c & { slug: CategoryIconKey } =>
      TERRITORY_KEYS.includes(c.slug as CategoryIconKey)
    )
    .map((c) => {
      const brand = CATEGORY_BRAND_CONFIG[c.slug];
      return {
        key: c.slug,
        name: c.name,
        color: brand?.color ?? "#6E2721",
        tagline: brand?.tagline ?? "",
        items: c.menuItems.map((item) => ({
          name: item.name,
          description: item.description,
          price: formatPrice(item.basePrice),
          originLabel: c.name,
        })),
      };
    });

  const secondaryCategories: SecondaryCategoryData[] = categories
    .filter((c) => !TERRITORY_KEYS.includes(c.slug as CategoryIconKey))
    .map((c) => {
      const brand = CATEGORY_BRAND_CONFIG[c.slug];
      return {
        key: c.slug,
        name: c.name,
        color: brand?.color ?? "#746350",
        tagline: brand?.tagline ?? "",
        items: c.menuItems.map((item) => ({
          name: item.name,
          description: item.description,
          price: formatPrice(item.basePrice),
        })),
      };
    });

  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <FontZoomProvider>
          <MenuHeader />

          <section className="relative overflow-hidden bg-espresso px-6 pb-[30px] pt-9">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url('/images/cobogo.png')",
                backgroundSize: "220px",
                backgroundRepeat: "repeat",
              }}
            />
            <div className="relative">
              <h1 className="m-0 font-serif text-[30px] font-medium leading-tight text-floral-white">
                Cozinha, mesa e território cearense.
              </h1>
              <p className="mt-3 font-serif text-[15px] italic text-[#F1DFC9]">
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

          <MenuView
            territoryCategories={territoryCategories}
            secondaryCategories={secondaryCategories}
          />

          <MenuFooter />
        </FontZoomProvider>
      </div>
    </div>
  );
}
