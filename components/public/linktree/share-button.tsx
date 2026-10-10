"use client";

import { Share } from "lucide-react";
import { toast } from "sonner";

// Botão redondo no canto do cartão: compartilha a página (ou copia o link).
export function LinktreeShareButton() {
  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Feira, Cozinha e Mesa", url });
      } catch {
        // usuário cancelou o compartilhamento
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartilhar"
      title="Compartilhar"
      className="absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/70"
    >
      <Share className="size-5" />
    </button>
  );
}
