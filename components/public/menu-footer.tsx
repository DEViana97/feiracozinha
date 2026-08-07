export type MenuFooterInfo = {
  name: string;
  tagline: string;
  address: string | null;
  phone: string | null;
  instagram: string | null;
};

function buildWhatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}`;
}

function buildInstagramUrl(instagram: string) {
  return `https://instagram.com/${instagram.replace("@", "")}`;
}

export function MenuFooter({ info }: { info: MenuFooterInfo }) {
  return (
    <footer className="relative overflow-hidden bg-espresso px-[22px] py-[26px] pt-[30px] text-floral-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/images/cobogo.png')",
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-5 w-[11px] bg-floral-white"
            style={{
              WebkitMaskImage: "url('/images/cobogo-mark.png')",
              maskImage: "url('/images/cobogo-mark.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
          <span className="font-serif text-base tracking-[2px] uppercase">
            {info.name}
          </span>
        </div>

        {info.address && (
          <p className="mb-3.5 text-[12.5px] leading-relaxed text-[#E9D9C6]">
            {info.address}
          </p>
        )}

        <div className="flex flex-col gap-1.5 text-[12.5px]">
          {info.phone && (
            <a
              href={buildWhatsappUrl(info.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F1DFC9]"
            >
              WhatsApp {info.phone}
            </a>
          )}
          {info.instagram && (
            <a
              href={buildInstagramUrl(info.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F1DFC9]"
            >
              {info.instagram}
            </a>
          )}
        </div>

        <p className="mt-5 text-[10.5px] uppercase tracking-[1.5px] text-[#D9C3AB]">
          {info.tagline}
        </p>
      </div>
    </footer>
  );
}
