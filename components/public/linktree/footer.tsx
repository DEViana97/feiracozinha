export function LinktreeFooter() {
  return (
    <footer className="relative">
      <div className="relative h-[22px] overflow-hidden">
        <div
          className="absolute inset-0 bg-dark-wine opacity-[0.35]"
          style={{
            WebkitMaskImage: "url('/images/cobogo.png')",
            maskImage: "url('/images/cobogo.png')",
            WebkitMaskSize: "120px",
            maskSize: "120px",
            WebkitMaskRepeat: "repeat",
            maskRepeat: "repeat",
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-3 py-4 pb-[26px]">
        <span className="text-center text-[11.5px] uppercase tracking-[1.5px] text-olive-wood">
          Fortaleza, Ceará
        </span>
        <span
          aria-hidden
          className="inline-block h-4 w-2 bg-dark-wine/40"
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
      </div>
    </footer>
  );
}
