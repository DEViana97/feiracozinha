"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type ItemDetailModalItem = {
  name: string;
  description: string;
  price: string;
  imageUrl?: string | null;
  isNew?: boolean;
};

type ItemDetailModalProps = {
  item: ItemDetailModalItem;
  children: ReactNode;
};

// Modal de detalhe do item, aberto ao tocar no card/linha do cardápio -
// só a foto grande, com botão de fechar sobreposto (seta pra baixo, como
// referência de mercado). Item sem foto não abre nada: renderiza só o card, sem clique.
export function ItemDetailModal({ item, children }: ItemDetailModalProps) {
  const scrollYRef = useRef(0);

  if (!item.imageUrl) return <div className="block w-full text-left">{children}</div>;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) scrollYRef.current = window.scrollY;
      }}
      onOpenChangeComplete={(open) => {
        // O lock de scroll da lib às vezes deixa a página no topo ao
        // fechar o modal - restaura a posição de leitura manualmente.
        if (!open) window.scrollTo(0, scrollYRef.current);
      }}
    >
      <DialogTrigger className="block w-full text-left">
        {children}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-[560px] gap-0 overflow-hidden rounded-2xl border-0 p-0 ring-0 sm:max-w-[560px]"
      >
        <DialogTitle className="sr-only">{item.name}</DialogTitle>
        <div className="relative aspect-[4/5] max-h-[88dvh] w-full bg-taupe/20">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 92vw, 560px"
            className="object-cover"
          />
          <DialogClose
            aria-label="Fechar"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-floral-white backdrop-blur-sm"
          >
            <ChevronDown className="size-4" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
