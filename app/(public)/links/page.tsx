import type { Metadata } from "next";
import { areReservationsEnabled, getRestaurantInfo } from "@/lib/queries";
import { LinktreeHero } from "@/components/public/linktree/hero";
import { LinktreeLinkList } from "@/components/public/linktree/link-list";
import { LinktreeFooter } from "@/components/public/linktree/footer";
import { LinktreeShareButton } from "@/components/public/linktree/share-button";
import { BackgroundVideo, type BackgroundClip } from "@/components/public/linktree/background-video";

// Vídeos de fundo, tocados em sequência e em loop.
const CLIPS: BackgroundClip[] = [
  { src: "/videos/links-bg.mp4", poster: "/videos/links-bg.jpg" },
  { src: "/videos/links-bg-2.mp4", poster: "/videos/links-bg-2.jpg" },
];

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
      {/* Fundo da tela: o mesmo vídeo, desfocado e escurecido (só em telas
          largas; no celular o cartão ocupa a tela toda). */}
      <div aria-hidden className="fixed inset-0 hidden overflow-hidden bg-[#1c2a30] min-[441px]:block">
        <BackgroundVideo
          clips={CLIPS}
          className="pointer-events-none h-full w-full scale-110 object-cover blur-2xl brightness-[0.55]"
        />
      </div>

      <div className="relative z-10 flex min-h-screen justify-center min-[441px]:items-center min-[441px]:px-6 min-[441px]:py-[5dvh]">
        {/* Cartão com o vídeo nítido ao fundo, mudo. O poster aparece
            enquanto carrega ou se o autoplay for bloqueado. */}
        <main className="relative flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-[#1c2a30] shadow-[0_20px_60px_rgba(0,0,0,0.45)] min-[441px]:min-h-[90dvh] min-[441px]:rounded-[28px]">
          <BackgroundVideo
            clips={CLIPS}
            className="pointer-events-none h-full w-full object-cover"
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
