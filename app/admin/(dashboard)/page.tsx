import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree, UtensilsCrossed, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [categoryCount, itemCount, inactiveCount] = await Promise.all([
    prisma.category.count(),
    prisma.menuItem.count(),
    prisma.menuItem.count({ where: { active: false } }),
  ]);

  const stats = [
    { label: "Categorias", value: categoryCount, icon: FolderTree },
    { label: "Itens no cardápio", value: itemCount, icon: UtensilsCrossed },
    { label: "Itens inativos", value: inactiveCount, icon: EyeOff },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumo do cardápio Feira.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
