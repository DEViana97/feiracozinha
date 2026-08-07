import Link from "next/link";

type LinktreeLink = {
  title: string;
  subtitle: string;
  href: string;
  icon: (props: { className?: string }) => React.ReactNode;
  external?: boolean;
};

function IconMenu({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 6h16M4 12h16M4 18h10" stroke="#6E2721" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconReserve({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="5" width="16" height="15" rx="1.5" stroke="#6E2721" strokeWidth="1.6" />
      <path d="M4 9.5h16M8 3v3M16 3v3" stroke="#6E2721" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconLocation({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"
        stroke="#6E2721"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9.5" r="2.2" stroke="#6E2721" strokeWidth="1.6" />
    </svg>
  );
}

function IconContact({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 5h16v13a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1Z"
        stroke="#6E2721"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// TODO: ajustar href de "Fale conosco" para o WhatsApp/Instagram real do
// restaurante antes de publicar.
function buildLinks(address: string | null): LinktreeLink[] {
  return [
    {
      title: "Ver cardápio",
      subtitle: "Da Serra, Do Sertão e Do Mar",
      href: "/cardapio",
      icon: IconMenu,
    },
    {
      title: "Reservar mesa",
      subtitle: "Escolha data e horário",
      href: "/reservas",
      icon: IconReserve,
    },
    {
      title: "Como chegar",
      subtitle: address ?? "Endereço e estacionamento",
      href: address
        ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
        : "https://maps.google.com/?q=SUBSTITUIR_ENDERECO",
      icon: IconLocation,
      external: true,
    },
    {
      title: "Fale conosco",
      subtitle: "WhatsApp e Instagram",
      href: "https://wa.me/55SUBSTITUIR_NUMERO",
      icon: IconContact,
      external: true,
    },
  ];
}

export function LinktreeLinkList({ address }: { address: string | null }) {
  const links = buildLinks(address);

  return (
    <section className="flex flex-col gap-3 px-5 pb-2 pt-[26px]">
      {links.map((link) => {
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
              <Icon />
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
