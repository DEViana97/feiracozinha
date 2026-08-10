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

// Modal de detalhe do item, aberto ao tocar no card/linha do cardápio —
// foto grande no topo, botão de fechar sobreposto (seta pra baixo, como
// referência de mercado), nome/preço/descrição num painel escuro embaixo.
export function ItemDetailModal({ item, children }: ItemDetailModalProps) {
  const scrollYRef = useRef(0);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) scrollYRef.current = window.scrollY;
      }}
      onOpenChangeComplete={(open) => {
        // O lock de scroll da lib às vezes deixa a página no topo ao
        // fechar o modal — restaura a posição de leitura manualmente.
        if (!open) window.scrollTo(0, scrollYRef.current);
      }}
    >
      <DialogTrigger className="block w-full text-left">
        {children}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-[420px] gap-0 overflow-hidden rounded-2xl border-0 p-0 ring-0 sm:max-w-[420px]"
      >
        <div className="relative aspect-[4/3] w-full bg-taupe/20">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="420px"
              className="object-cover"
            />
          )}
          <DialogClose
            aria-label="Fechar"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-floral-white backdrop-blur-sm"
          >
            <ChevronDown className="size-4" />
          </DialogClose>
        </div>

        <div className="relative overflow-hidden bg-espresso px-5 py-5">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('/images/cobogo.png')",
              backgroundSize: "200px",
              backgroundRepeat: "repeat",
            }}
          />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="m-0 font-serif text-lg font-medium leading-tight text-floral-white">
                {item.name}
              </DialogTitle>
              {item.isNew && (
                <span className="mt-0.5 shrink-0 rounded-full bg-copperwood px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[1px] text-floral-white">
                  Novidade
                </span>
              )}
            </div>
            <p className="mt-1 font-sans text-[15px] font-semibold text-[#E3A94A]">
              {item.price}
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[#F1DFC9]">
              {item.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
