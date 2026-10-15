import { BackgroundVideo } from "@/components/public/linktree/background-video";

export type MenuFooterInfo = {
  name: string;
  tagline: string;
  address: string | null;
  phone: string | null;
  instagram: string | null;
};

export function buildWhatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}`;
}

export function buildInstagramUrl(instagram: string) {
  return `https://instagram.com/${instagram.replace("@", "")}`;
}

export type MenuFooterVideo = { src: string; poster: string };

// `video` (opcional): usa um vídeo mudo em loop como fundo, com camada escura
// por cima para o texto claro continuar legível. Sem ele, usa o cobogó.
// `light`: cobogó claro com texto escuro, igual à primeira seção do cardápio.
export function MenuFooter({
  info,
  video,
  light,
}: {
  info: MenuFooterInfo;
  video?: MenuFooterVideo;
  light?: boolean;
}) {
  return (
    <footer
      className={`relative overflow-hidden px-[22px] py-[26px] pt-[30px] ${
        light ? "bg-floral-white text-espresso" : "bg-espresso text-floral-white"
      }`}
    >
      {light ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cobogo-cream.jpg')" }}
        />
      ) : video ? (
        <>
          {/* O mesmo vídeo duas vezes: o BackgroundVideo faz a dissolução entre as
              cópias, então o fim do loop não dá salto. */}
          <BackgroundVideo
            clips={[video, video]}
            className="pointer-events-none h-full w-full object-cover object-[center_72%]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#3a100c]/75 via-[#3a100c]/65 to-[#3a100c]/85" />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cobogo-wine.jpg')" }}
        />
      )}
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <span
            aria-hidden
            className={`inline-block h-5 w-[11px] ${light ? "bg-espresso" : "bg-floral-white"}`}
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
          <p className={`mb-3.5 text-[12.5px] leading-relaxed ${light ? "text-espresso" : "text-[#E9D9C6]"}`}>
            {info.address}
          </p>
        )}

        <div className="flex flex-col gap-1.5 text-[12.5px]">
          {info.phone && (
            <a
              href={buildWhatsappUrl(info.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className={light ? "text-espresso" : "text-[#F1DFC9]"}
            >
              WhatsApp {info.phone}
            </a>
          )}
          {info.instagram && (
            <a
              href={buildInstagramUrl(info.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className={light ? "text-espresso" : "text-[#F1DFC9]"}
            >
              {info.instagram}
            </a>
          )}
        </div>

        <p className={`mt-5 text-[10.5px] uppercase tracking-[1.5px] ${light ? "text-dark-wine" : "text-[#D9C3AB]"}`}>
          {info.tagline}
        </p>
      </div>
    </footer>
  );
}
