export function LinktreeFooter() {
  return (
    <footer className="relative">
      <div className="pt-4 text-center text-[11.5px] uppercase tracking-[1.5px] text-olive-wood">
        Fortaleza, Ceará
      </div>
      <div className="relative mt-4 mb-[26px] h-[22px] overflow-hidden">
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
    </footer>
  );
}
