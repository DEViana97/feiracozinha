import Link from "next/link";
import { BackgroundVideo } from "@/components/public/linktree/background-video";

const VIDEO = { src: "/videos/footer-bg.mp4", poster: "/videos/footer-bg.jpg" };

export function LandingReservationCta() {
  return (
    <section
      id="reservar"
      className="relative overflow-hidden bg-dark-wine px-8 py-[90px] text-center"
    >
      {/* Mesmo fundo do rodapé: o vídeo duas vezes, para o fim do loop não dar salto. */}
      <BackgroundVideo
        clips={[VIDEO, VIDEO]}
        className="pointer-events-none h-full w-full object-cover object-[center_72%]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#3a100c]/75 via-[#3a100c]/65 to-[#3a100c]/85" />
      <div className="relative mx-auto max-w-[560px]">
        <h2 className="m-0 mb-3.5 font-serif text-[34px] font-medium text-floral-white">
          Reserve sua mesa na Feira
        </h2>
        <p className="mb-8 text-[15px] leading-[1.6] text-[#F1DFC9]">
          A origem do Ceará no centro da mesa. Separe seu lugar.
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
