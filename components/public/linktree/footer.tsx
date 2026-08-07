export function LinktreeFooter() {
  return (
    <footer className="relative">
      <div className="relative h-[22px] overflow-hidden">
        <div
          className="absolute inset-0 bg-dark-wine opacity-[0.35]"
          style={{
            WebkitMaskImage: "url('/images/cobogo-pattern.png')",
            maskImage: "url('/images/cobogo-pattern.png')",
            WebkitMaskSize: "120px",
            maskSize: "120px",
            WebkitMaskRepeat: "repeat",
            maskRepeat: "repeat",
          }}
        />
      </div>
      <div className="py-4 pb-[26px] text-center text-[11.5px] uppercase tracking-[1.5px] text-olive-wood">
        Fortaleza, Ceará
      </div>
    </footer>
  );
}
