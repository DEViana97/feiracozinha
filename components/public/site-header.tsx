import Link from "next/link";
import { getRestaurantInfo, getAllActiveItemsForSearch } from "@/lib/queries";
import { RestaurantDrawer } from "@/components/public/restaurant-drawer";
import { SearchOverlay } from "@/components/public/search-overlay";

export async function SiteHeader() {
  const [info, items] = await Promise.all([
    getRestaurantInfo(),
    getAllActiveItemsForSearch(),
  ]);

  const searchItems = items.map((item) => ({
    ...item,
    basePrice: item.basePrice.toString(),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3">
        <RestaurantDrawer info={info} />
        <Link
          href="/"
          className="flex items-center gap-1.5 font-serif text-lg tracking-widest"
        >
          <span className="inline-block size-1.5 rotate-45 bg-primary" />
          FEIRA
        </Link>
        <SearchOverlay items={searchItems} />
      </div>
    </header>
  );
}
