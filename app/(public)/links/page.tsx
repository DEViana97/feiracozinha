import type { Metadata } from "next";
import { getRestaurantInfo } from "@/lib/queries";
import { LinktreeHero } from "@/components/public/linktree/hero";
import { LinktreeLinkList } from "@/components/public/linktree/link-list";
import { LinktreeFooter } from "@/components/public/linktree/footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Feira, Cozinha e Mesa",
  description: "A origem do Ceará no centro da mesa.",
};

export default async function LinktreePage() {
  const info = await getRestaurantInfo();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#1c2a30] font-sans">
      {/* Vídeo do mar como fundo da tela toda (sem som, em loop). O poster
          aparece enquanto o vídeo carrega ou se o autoplay for bloqueado. */}
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/videos/links-bg.jpg"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/links-bg.mp4" type="video/mp4" />
      </video>

      {/* Conteúdo centralizado e estreito; o rodapé fica fora da coluna, colado
          no fim da tela. */}
      <div className="relative z-10 mx-auto w-full max-w-[420px] flex-1">
        <LinktreeHero />
        <LinktreeLinkList address={info.address} phone={info.phone} />
      </div>
      <LinktreeFooter />
    </div>
  );
}
