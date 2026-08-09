import { getAllCategoriesForAdmin } from "@/lib/queries";
import { serializeCategories } from "@/lib/types";
import { CategoryManager } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const raw = await getAllCategoriesForAdmin();
  const categories = serializeCategories(raw);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Categorias</h1>
        <p className="text-sm text-muted-foreground">
          Arraste para reordenar.
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
