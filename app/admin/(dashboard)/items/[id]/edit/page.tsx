import { notFound } from "next/navigation";
import {
  getCategoriesForSelect,
  // getAllTags, // Tags temporariamente desativado — ver nota em AGENTS.md.
  getMenuItemForEdit,
} from "@/lib/queries";
import { ItemForm } from "@/components/admin/item-form";
import type { MenuItemInput } from "@/lib/validations/item";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, item] = await Promise.all([
    getCategoriesForSelect(),
    getMenuItemForEdit(id),
  ]);

  if (!item) notFound();

  const defaultValues: MenuItemInput = {
    name: item.name,
    description: item.description,
    basePrice: item.basePrice.toString(),
    categoryId: item.categoryId,
    subcategoryId: item.subcategoryId,
    imageUrl: item.imageUrl,
    featured: item.featured,
    active: item.active,
    // Mantém as tags já associadas ao item (sem UI pra editar enquanto
    // a tela de tags estiver desativada — ver nota em AGENTS.md).
    tagIds: item.tags.map((t) => t.tagId),
    variants: item.variants.map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description ?? "",
      price: v.price.toString(),
      imageUrl: v.imageUrl,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Editar item</h1>
      </div>
      <ItemForm categories={categories} defaultValues={defaultValues} itemId={item.id} />
    </div>
  );
}
