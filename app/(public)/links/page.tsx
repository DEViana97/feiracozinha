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
    <div
      className="flex min-h-screen flex-col bg-[#EDE4D6] font-sans"
      style={{
        backgroundImage: "url('/images/cobogo-cream.jpg')",
        backgroundSize: "140px auto",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Conteúdo centralizado e estreito; o cobogó é o fundo da tela toda e o
          rodapé fica fora da coluna, colado no fim da tela. */}
      <div className="mx-auto w-full max-w-[420px] flex-1">
        <LinktreeHero />
        <LinktreeLinkList address={info.address} phone={info.phone} />
      </div>
      <LinktreeFooter />
    </div>
  );
}
