"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth-signout";
import { LayoutDashboard, FolderTree, UtensilsCrossed, Tags, Settings, Images, LogOut } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categorias", icon: FolderTree },
  { href: "/admin/items", label: "Itens", icon: UtensilsCrossed },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/carousel", label: "Carrossel", icon: Images },
  { href: "/admin/settings", label: "Restaurante", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full justify-between">
      <div className="space-y-1">
        <div className="px-3 py-4">
          <span className="font-serif text-xl text-foreground">Feira</span>
          <p className="text-xs text-muted-foreground">Painel administrativo</p>
        </div>
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
      <form action={signOutAction} className="p-3">
        <Button type="submit" variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="size-4" />
          Sair
        </Button>
      </form>
    </nav>
  );
}
