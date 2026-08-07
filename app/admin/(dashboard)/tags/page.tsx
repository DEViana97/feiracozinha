// Tela de gestão de tags temporariamente desativada — ver nota em AGENTS.md.
// import { getAllTags } from "@/lib/queries";
// import { TagManager } from "@/components/admin/tag-manager";
//
// export const dynamic = "force-dynamic";
//
// export default async function AdminTagsPage() {
//   const tags = await getAllTags();
//
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="font-serif text-2xl">Tags e alergênicos</h1>
//         <p className="text-sm text-muted-foreground">
//           Reutilizadas nos itens do cardápio.
//         </p>
//       </div>
//       <TagManager tags={tags} />
//     </div>
//   );
// }

export default function AdminTagsPage() {
  return (
    <div className="space-y-2">
      <h1 className="font-serif text-2xl">Tags e alergênicos</h1>
      <p className="text-sm text-muted-foreground">
        Esta tela está temporariamente desativada.
      </p>
    </div>
  );
}
