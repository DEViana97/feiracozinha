"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButton({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
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
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      aria-label="Compartilhar"
      title="Compartilhar"
    >
      <Share2 className="size-4" />
    </Button>
  );
}
