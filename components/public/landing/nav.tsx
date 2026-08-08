import Link from "next/link";
import Image from "next/image";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-dark-wine/[0.12] bg-floral-white">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-8 py-[18px]">
        <div className="flex items-center gap-1.5">
          <Image src="/images/cobogo-mark.png" alt="" width={10} height={20} className="h-5 w-auto" />
          <span className="font-serif text-[21px] tracking-[1.5px] text-dark-wine">
            FEIRA
          </span>
        </div>
        <Link
          href="#reservar"
          className="border-b border-dark-wine pb-0.5 font-sans text-sm font-semibold text-dark-wine"
        >
          Reservar mesa
        </Link>
      </div>
    </header>
  );
}
