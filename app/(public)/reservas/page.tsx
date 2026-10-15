import { notFound } from "next/navigation";
import { areReservationsEnabled, getRestaurantInfo } from "@/lib/queries";
import { MenuHeader } from "@/components/public/menu-header";
import { ReservationForm } from "@/components/public/reservation-form";
import { buildWhatsappUrl } from "@/components/public/menu-footer";
import { restaurantNow } from "@/lib/reservation-availability";

export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  if (!(await areReservationsEnabled())) notFound();
  const info = await getRestaurantInfo();
  const now = restaurantNow();
  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <MenuHeader />
        <ReservationForm
          today={now.date}
          nowTime={now.time}
          whatsappUrl={info.phone ? buildWhatsappUrl(info.phone) : null}
        />
      </div>
    </div>
  );
}
