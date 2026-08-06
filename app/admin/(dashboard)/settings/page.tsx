import { getRestaurantInfo } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const info = await getRestaurantInfo();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Informações do restaurante</h1>
        <p className="text-sm text-muted-foreground">
          Exibidas no menu lateral e usadas em toda a área pública.
        </p>
      </div>
      <SettingsForm
        defaultValues={{
          name: info.name,
          tagline: info.tagline,
          address: info.address ?? "",
          phone: info.phone ?? "",
          email: info.email ?? "",
          instagram: info.instagram ?? "",
          drawerText: info.drawerText ?? "",
        }}
      />
    </div>
  );
}
