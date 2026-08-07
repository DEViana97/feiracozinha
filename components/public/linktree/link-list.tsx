import Link from "next/link";
import {
  Menu,
  CalendarDays,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

type LinktreeLink = {
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

// TODO: ajustar hrefs de "Como chegar" e "Fale conosco" para o endereço
// real / links de WhatsApp e Instagram do restaurante antes de publicar.
const LINKS: LinktreeLink[] = [
  {
    title: "Ver cardápio",
    subtitle: "Da Serra, Do Sertão e Do Mar",
    href: "/cardapio",
    icon: Menu,
  },
  {
    title: "Reservar mesa",
    subtitle: "Escolha data e horário",
    href: "/reservas",
    icon: CalendarDays,
  },
  {
    title: "Como chegar",
    subtitle: "Endereço e estacionamento",
    href: "https://maps.google.com/?q=SUBSTITUIR_ENDERECO",
    icon: MapPin,
    external: true,
  },
  {
    title: "Fale conosco",
    subtitle: "WhatsApp e Instagram",
    href: "https://wa.me/55SUBSTITUIR_NUMERO",
    icon: MessageCircle,
    external: true,
  },
];

export function LinktreeLinkList() {
  return (
    <section className="flex flex-col gap-3 px-5 pb-2 pt-[26px]">
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.title}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3.5 rounded-[10px] border border-dark-wine/[0.14] bg-[#FFFDF9] px-4 py-3.5 text-[#3B2A26] transition-colors hover:border-dark-wine/40"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-dark-wine/[0.08]">
              <Icon size={18} strokeWidth={1.6} className="text-dark-wine" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-base text-[#3B2A26]">
                {link.title}
              </div>
              <div className="mt-0.5 text-[12.5px] text-[#5A4E45]">
                {link.subtitle}
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="#6E2721"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        );
      })}
    </section>
  );
}
