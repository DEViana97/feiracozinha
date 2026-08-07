import { getAllIdentitySlidesForAdmin } from "@/lib/queries";
import { SlideManager } from "@/components/admin/slide-manager";

export const dynamic = "force-dynamic";

export default async function AdminCarouselPage() {
  const slides = await getAllIdentitySlidesForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Carrossel de identidade</h1>
        <p className="text-sm text-muted-foreground">
          Fotos exibidas no carrossel do topo do cardápio. Arraste para reordenar.
        </p>
      </div>
      <SlideManager slides={slides} />
    </div>
  );
}
