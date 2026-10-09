export function LinktreeFooter() {
  return (
    <footer className="relative">
      <div className="pt-4 text-center text-[11.5px] uppercase tracking-[1.5px] text-olive-wood">
        Fortaleza, Ceará
      </div>
      <div className="relative mt-4 h-[22px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/cobogo-cream.jpg')",
            backgroundSize: "140px auto",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
    </footer>
  );
}
