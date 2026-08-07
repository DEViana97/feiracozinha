import { getCategoriesForSelect /* , getAllTags */ } from "@/lib/queries";
import { ItemForm } from "@/components/admin/item-form";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  // Tags temporariamente desativado — ver nota em AGENTS.md.
  const categories = await getCategoriesForSelect();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Novo item</h1>
      </div>
      <ItemForm categories={categories} />
    </div>
  );
}
