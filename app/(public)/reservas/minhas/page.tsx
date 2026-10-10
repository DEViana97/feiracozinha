import { notFound } from "next/navigation";
import { areReservationsEnabled } from "@/lib/queries";
import { MenuHeader } from "@/components/public/menu-header";
import { MyReservations } from "@/components/public/my-reservations";

export const dynamic = "force-dynamic";

export default async function MinhasReservasPage() {
  if (!(await areReservationsEnabled())) notFound();
  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <MenuHeader />
        <MyReservations />
      </div>
    </div>
  );
}
