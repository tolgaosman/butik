import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { Testimonials } from "@/components/sections/Testimonials";
import { LocationMap } from "@/components/sections/LocationMap";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <NewArrivals />
      <PromoBanner />
      <Testimonials />
      <LocationMap />
    </>
  );
}
