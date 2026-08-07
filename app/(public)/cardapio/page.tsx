import { getCategoriesWithItems } from "@/lib/queries";
import { formatPrice } from "@/lib/format";
import { MenuHeader } from "@/components/public/menu-header";
import { IdentityCarousel } from "@/components/public/identity-carousel";
import {
  MenuView,
  type SecondaryCategoryData,
} from "@/components/public/menu-view";
import { MenuFooter } from "@/components/public/menu-footer";
import { CATEGORY_BRAND_CONFIG } from "@/components/public/category-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// NOTA: nenhuma categoria do seed atual (da-feira/do-mar/da-terra/da-doceira/
// da-adega) bate com as chaves de CATEGORY_BRAND_CONFIG (serra/sertao/mar/
// adega/bebidas/sobremesas), então por ora TODAS renderizam como seção
// "secundária" (lista simples, sem ícone/card grande) até a categorização
// território x secundária ser confirmada — ver aviso no final da tarefa.
export default async function CardapioPage() {
  const categories = await getCategoriesWithItems();

  const secondaryCategories: SecondaryCategoryData[] = categories.map((c) => {
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
      })),
    };
  });

  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <MenuHeader />

        <section className="relative overflow-hidden px-6 pb-[30px] pt-9">
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage: "url('/images/cobogo-pattern.png')",
              backgroundSize: "220px",
              backgroundRepeat: "repeat",
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

        <IdentityCarousel />

        <MenuView territoryCategories={[]} secondaryCategories={secondaryCategories} />

        <MenuFooter />
      </div>
    </div>
  );
}
