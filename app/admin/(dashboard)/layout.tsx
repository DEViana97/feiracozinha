import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border">
        <AdminNav />
      </aside>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
