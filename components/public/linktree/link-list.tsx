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
      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconReserve({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="5" width="16" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 9.5h16M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconLocation({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconAbout({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconContact({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 5h16v13a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buildLinks(
  address: string | null,
  reservationsEnabled: boolean,
  mapsUrl?: string | null,
  instagram?: string | null
): LinktreeLink[] {
  const handle = instagram ? (instagram.startsWith("@") ? instagram : `@${instagram}`) : null;
  const links: LinktreeLink[] = [
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
      title: "Sobre",
      subtitle: "Nossa história e origem",
      href: "/",
      icon: IconAbout,
    },
    {
      title: "Como chegar",
      subtitle: address ?? "Endereço e estacionamento",
      href: mapsUrl
        ? mapsUrl
        : address
        ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
        : "https://maps.google.com/?q=SUBSTITUIR_ENDERECO",
      icon: IconLocation,
      external: true,
    },
    ...(handle
      ? [
          {
            title: "Fale conosco",
            subtitle: `Instagram ${handle}`,
            href: `https://instagram.com/${handle.replace("@", "")}`,
            icon: IconContact,
            external: true,
          },
        ]
      : []),
  ];
  return reservationsEnabled ? links : links.filter((l) => l.href !== "/reservas");
}

export function LinktreeLinkList({
  address,
  reservationsEnabled = true,
  mapsUrl,
  instagram,
}: {
  address: string | null;
  reservationsEnabled?: boolean;
  mapsUrl?: string | null;
  instagram?: string | null;
}) {
  const links = buildLinks(address, reservationsEnabled, mapsUrl, instagram);

  return (
    <section className="flex flex-col gap-3 px-5 pb-[26px] pt-[26px]">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.title}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3.5 rounded-xl border border-white/[0.26] bg-white/[0.22] px-4 py-3 text-white transition-colors hover:bg-white/[0.3]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-white">
              <Icon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-[17px] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                {link.title}
              </div>
              <div className="mt-0.5 text-[12.5px] text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                {link.subtitle}
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="flex-shrink-0 text-white/85"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
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
