import Link from "next/link";

export function LandingReservationCta() {
  return (
    <section
      id="reservar"
      className="relative overflow-hidden bg-dark-wine px-8 py-[90px] text-center"
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "url('/images/cobogo.png')",
          backgroundSize: "220px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="relative mx-auto max-w-[560px]">
        <h2 className="m-0 mb-3.5 font-serif text-[34px] font-medium text-floral-white">
          Reserve sua mesa na Feira
        </h2>
        <p className="mb-8 text-[15px] leading-[1.6] text-[#F1DFC9]">
          A origem do Ceará no centro da mesa — separe seu lugar.
        </p>
        <Link
          href="/reservas"
          className="inline-block rounded-md bg-floral-white px-9 py-4 font-sans text-[15px] font-semibold text-dark-wine"
        >
          Reservar mesa
        </Link>
      </div>
    </section>
  );
}
