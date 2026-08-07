// TODO: confirmar endereço, WhatsApp e Instagram reais com o Fernando antes
// de publicar — os valores abaixo vieram do mockup do Claude Design e podem
// ser placeholder.
const ADDRESS = "Rua das Flores, 123 — Praia de Iracema, Fortaleza/CE";
const WHATSAPP_URL = "https://wa.me/5585999990000";
const WHATSAPP_LABEL = "WhatsApp (85) 99999-0000";
const INSTAGRAM_URL = "https://instagram.com/feiracozinhaemesa";
const INSTAGRAM_LABEL = "@feiracozinhaemesa";

export function MenuFooter() {
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
          <span className="font-serif text-base tracking-[2px]">
            FEIRA, COZINHA E MESA
          </span>
        </div>

        <p className="mb-3.5 text-[12.5px] leading-relaxed text-[#E9D9C6]">
          {ADDRESS}
        </p>

        <div className="flex flex-col gap-1.5 text-[12.5px]">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#F1DFC9]">
            {WHATSAPP_LABEL}
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-[#F1DFC9]">
            {INSTAGRAM_LABEL}
          </a>
        </div>

        <p className="mt-5 text-[10.5px] uppercase tracking-[1.5px] text-[#D9C3AB]">
          Da nossa terra para o centro da sua mesa.
        </p>
      </div>
    </footer>
  );
}
