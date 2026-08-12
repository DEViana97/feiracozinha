import { AdminNav } from "@/components/admin/admin-nav";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border">
        <AdminNav />
      </aside>
      <AdminMobileNav />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
