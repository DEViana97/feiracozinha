import type { Metadata } from "next";
import { areReservationsEnabled, getRestaurantInfo } from "@/lib/queries";
import { LinktreeHero } from "@/components/public/linktree/hero";
import { LinktreeLinkList } from "@/components/public/linktree/link-list";
import { LinktreeFooter } from "@/components/public/linktree/footer";
import { LinktreeShareButton } from "@/components/public/linktree/share-button";
import Image from "next/image";

// Foto de fundo do cartão (e, desfocada, da tela em volta).
const BACKGROUND = "/images/caixotes-feira.jpeg";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Feira, Cozinha e Mesa",
  description: "A origem do Ceará no centro da mesa.",
};

export default async function LinktreePage() {
  const [info, reservationsEnabled] = await Promise.all([
    getRestaurantInfo(),
    areReservationsEnabled(),
  ]);

  return (
    <div className="relative min-h-screen font-sans">
      {/* Fundo da tela: a mesma foto, desfocada e escurecida (só em telas
          largas; no celular o cartão ocupa a tela toda). */}
      <div aria-hidden className="fixed inset-0 hidden overflow-hidden bg-[#1c2a30] min-[441px]:block">
        <Image
          src={BACKGROUND}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover blur-2xl brightness-[0.55]"
        />
      </div>

      <div className="relative z-10 flex min-h-screen justify-center min-[441px]:items-center min-[441px]:px-6 min-[441px]:py-[5dvh]">
        {/* Cartão com a foto nítida ao fundo. */}
        <main className="relative flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-[#1c2a30] shadow-[0_20px_60px_rgba(0,0,0,0.45)] min-[441px]:min-h-[90dvh] min-[441px]:rounded-[28px]">
          <Image
            src={BACKGROUND}
            alt=""
            fill
            priority
            sizes="440px"
            className="pointer-events-none object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />

          <LinktreeShareButton />
          <div className="relative z-10 flex flex-1 flex-col">
            <LinktreeHero />
            <LinktreeLinkList
              address={info.address}
              phone={info.phone}
              reservationsEnabled={reservationsEnabled}
              mapsUrl={(info as { mapsUrl?: string | null }).mapsUrl || null}
            />
            <LinktreeFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
