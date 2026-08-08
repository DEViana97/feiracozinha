import type { Metadata } from "next";
import { getRestaurantInfo, getIdentitySlides } from "@/lib/queries";
import { LandingNav } from "@/components/public/landing/nav";
import { LandingHero } from "@/components/public/landing/hero";
import { LandingManifesto } from "@/components/public/landing/manifesto";
import { LandingMotivation } from "@/components/public/landing/motivation";
import { LandingIdentityCarousel } from "@/components/public/landing/identity-carousel";
import { LandingOrigins } from "@/components/public/landing/origins";
import { LandingValues } from "@/components/public/landing/values";
import { LandingVision } from "@/components/public/landing/vision";
import { LandingEnvironment } from "@/components/public/landing/environment";
import { LandingReservationCta } from "@/components/public/landing/reservation-cta";
import { LandingLocation } from "@/components/public/landing/location";
import { MenuFooter } from "@/components/public/menu-footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Feira — Cozinha e Mesa",
  description: "A origem do Ceará no centro da mesa.",
};

export default async function LandingPage() {
  const [info, slides] = await Promise.all([getRestaurantInfo(), getIdentitySlides()]);

  return (
    <div className="bg-floral-white font-sans text-[#3B2A26]">
      <LandingNav />
      <LandingHero />
      <LandingManifesto />
      <LandingMotivation />
      <LandingIdentityCarousel
        slides={slides.map((s) => ({ id: s.id, imageUrl: s.imageUrl, caption: s.caption }))}
      />
      <LandingOrigins />
      <LandingValues />
      <LandingVision />
      <LandingEnvironment />
      <LandingReservationCta />
      <LandingLocation
        info={{ address: info.address, phone: info.phone, instagram: info.instagram }}
      />
      <MenuFooter
        info={{
          name: info.name,
          tagline: info.tagline,
          address: info.address,
          phone: info.phone,
          instagram: info.instagram,
        }}
      />
    </div>
  );
}
