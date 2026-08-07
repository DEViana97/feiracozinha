import type { Metadata } from "next";
import { LinktreeHero } from "@/components/public/linktree/hero";
import { LinktreeLinkList } from "@/components/public/linktree/link-list";
import { LinktreeCategoryPreview } from "@/components/public/linktree/category-preview";
import { LinktreeFooter } from "@/components/public/linktree/footer";

export const metadata: Metadata = {
  title: "Feira — Cozinha e Mesa",
  description: "A origem do Ceará no centro da mesa.",
};

export default function LinktreePage() {
  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[420px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        <LinktreeHero />
        <LinktreeLinkList />
        <LinktreeCategoryPreview />
        <LinktreeFooter />
      </div>
    </div>
  );
}
