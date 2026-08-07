function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-taupe/15 ${className ?? ""}`} />;
}

export default function CardapioLoading() {
  return (
    <div className="flex min-h-screen justify-center bg-[#EDE4D6] font-sans">
      <div className="relative min-h-screen w-full max-w-[480px] bg-floral-white shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="border-b border-dark-wine/[0.15] px-[18px] py-4">
          <div className="flex items-center justify-between">
            <span className="w-[70px]" />
            <Pulse className="h-6 w-24" />
            <Pulse className="h-8 w-[70px] rounded-full" />
          </div>
          <div className="mt-2.5 flex justify-center">
            <Pulse className="h-2.5 w-24" />
          </div>
        </div>

        {/* Hero */}
        <div className="px-6 pb-[30px] pt-9">
          <Pulse className="h-8 w-4/5" />
          <Pulse className="mt-3 h-4 w-3/5" />
        </div>

        {/* Identity carousel */}
        <div className="px-5">
          <Pulse className="h-[210px] w-full rounded-[10px]" />
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 py-4 pl-5 pr-[18px]">
          <div className="flex flex-1 gap-2">
            <Pulse className="h-9 w-24 rounded-full" />
            <Pulse className="h-9 w-24 rounded-full" />
            <Pulse className="h-9 w-24 rounded-full" />
          </div>
          <Pulse className="h-9 w-9 rounded-full" />
        </div>

        {/* Item cards */}
        <div className="flex flex-col gap-3 px-5 pb-7">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-md border border-black/[0.07] bg-[#FFFDF9] p-3.5"
            >
              <Pulse className="h-[106px] w-[106px] shrink-0 rounded-full" />
              <div className="flex-1 space-y-2 py-1">
                <Pulse className="h-4 w-3/4" />
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
