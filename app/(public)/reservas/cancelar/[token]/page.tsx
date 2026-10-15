import Link from "next/link";
import { notFound } from "next/navigation";
import { areReservationsEnabled, getRestaurantInfo } from "@/lib/queries";
import { MenuHeader } from "@/components/public/menu-header";
import { CancelReservationButton } from "@/components/public/cancel-reservation-button";
import { getReservationByToken } from "@/lib/actions/reservation";

export const dynamic = "force-dynamic";

export default async function CancelarReservaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if (!(await areReservationsEnabled())) notFound();
  const { token } = await params;
  const info = await getRestaurantInfo();
  const instagram = info.instagram
    ? info.instagram.startsWith("@")
      ? info.instagram
      : `@${info.instagram}`
    : null;
  const reservation = await getReservationByToken(token);

  const dateLabel = reservation
    ? new Date(`${reservation.date}T00:00:00`).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      })
    : "";

  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <MenuHeader />
        <div className="px-[22px] pb-10 pt-[26px]">
          {!reservation ? (
            <>
              <h1 className="m-0 mb-1.5 font-serif text-[26px] text-espresso">
                Reserva não encontrada
              </h1>
              <p className="mb-6 text-[13.5px] leading-relaxed text-taupe">
                Confira se o link está completo{instagram ? ` ou fale com a gente pelo Instagram ${instagram}` : ""}.
              </p>
            </>
          ) : (
            <>
              <h1 className="m-0 mb-1.5 font-serif text-[26px] text-espresso">
                Cancelar reserva
              </h1>
              <div className="mb-6 rounded-lg border border-taupe/20 bg-[#FFFDF9] p-4 text-[14px] leading-relaxed text-espresso">
                <p className="m-0 font-semibold">{reservation.name}</p>
                <p className="m-0 capitalize text-taupe">
                  {dateLabel} às {reservation.time}
                </p>
                <p className="m-0 text-taupe">
                  {reservation.people} {reservation.people === 1 ? "pessoa" : "pessoas"} ·{" "}
                  {reservation.environmentName}
                </p>
              </div>
              <CancelReservationButton
                token={token}
                alreadyCancelled={reservation.status === "CANCELLED"}
                locked={reservation.locked}
              />
            </>
          )}
          <Link
            href="/reservas"
            className="mt-4 block text-center text-[13px] font-semibold text-dark-wine"
          >
            Fazer uma nova reserva
          </Link>
        </div>
      </div>
    </div>
  );
}
