import { getAllTags } from "@/lib/queries";
import { TagManager } from "@/components/admin/tag-manager";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Tags e alergênicos</h1>
        <p className="text-sm text-muted-foreground">
          Reutilizadas nos itens do cardápio.
        </p>
      </div>
      <TagManager tags={tags} />
    </div>
  );
}
