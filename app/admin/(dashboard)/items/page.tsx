import { getAllMenuItemsForAdmin, getCategoriesForSelect } from "@/lib/queries";
import { ItemList } from "@/components/admin/item-list";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage() {
  const [items, categories] = await Promise.all([
    getAllMenuItemsForAdmin(),
    getCategoriesForSelect(),
  ]);

  const serialized = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    basePrice: item.basePrice.toString(),
    imageUrl: item.imageUrl,
    active: item.active,
    category: item.category,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Itens do cardápio</h1>
        <p className="text-sm text-muted-foreground">
          {items.length} item(ns) cadastrado(s).
        </p>
      </div>
      <ItemList items={serialized} categories={categories} />
    </div>
  );
}
