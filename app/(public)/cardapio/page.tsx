import { getCategoriesWithItems, getRestaurantInfo } from "@/lib/queries";
import { serializeCategories } from "@/lib/types";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { HeroTitle } from "@/components/public/hero-title";
import { IdentityCarousel } from "@/components/public/identity-carousel";
import { MenuBrowser } from "@/components/public/menu-browser";
import { WineSection } from "@/components/public/wine-section";
import { BackToTopButton } from "@/components/public/back-to-top-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [rawCategories, info] = await Promise.all([
    getCategoriesWithItems(),
    getRestaurantInfo(),
  ]);

  const categories = serializeCategories(rawCategories);
  const wineCategory = categories.find((c) => c.slug === "da-adega");
  const menuCategories = categories.filter((c) => c.slug !== "da-adega");

  const heroImages = categories
    .filter((c) => c.coverImageUrl)
    .slice(0, 5)
    .map((c) => ({ url: c.coverImageUrl as string, alt: c.name }));

  return (
    <div>
      <HeroCarousel images={heroImages} />
      <HeroTitle name={info.name} tagline={info.tagline} />
      <IdentityCarousel />
      <MenuBrowser categories={menuCategories} />
      {wineCategory && wineCategory.menuItems.length > 0 && (
        <WineSection category={wineCategory} />
      )}
      <BackToTopButton />
    </div>
  );
}
