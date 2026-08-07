import { MenuHeader } from "@/components/public/menu-header";
import { ReservationForm } from "@/components/public/reservation-form";

export default function ReservasPage() {
  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <MenuHeader />
        <ReservationForm />
      </div>
    </div>
  );
}
