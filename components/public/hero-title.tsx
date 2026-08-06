import { FontSizeToggle } from "@/components/public/font-size-toggle";
import { ShareButton } from "@/components/public/share-button";

export function HeroTitle({ name, tagline }: { name: string; tagline: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-6">
      <div>
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{name}</h1>
        <p className="mt-1 font-serif italic text-muted-foreground">{tagline}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 pt-1">
        <FontSizeToggle />
        <ShareButton title={name} text={tagline} />
      </div>
    </div>
  );
}
