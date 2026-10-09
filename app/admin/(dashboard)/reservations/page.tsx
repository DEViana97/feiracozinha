import { getEnvironmentsForAdmin, getReservationsForAdmin } from "@/lib/queries";
import { ReservationsTabs } from "@/components/admin/reservations-tabs";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const [environments, reservations] = await Promise.all([
    getEnvironmentsForAdmin(),
    getReservationsForAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl">Reservas</h1>
        <p className="text-sm text-muted-foreground">
          Configure os ambientes e as mesas disponíveis e acompanhe as reservas feitas pelo
          site.
        </p>
      </div>
      <ReservationsTabs environments={environments} reservations={reservations} />
    </div>
  );
}
