import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { BestSellers } from "@/components/sections/BestSellers";
import { SocialProof } from "@/components/sections/SocialProof";
import { LocationMap } from "@/components/sections/LocationMap";
import { GridSkeleton } from "@/components/ui/GridSkeleton";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<GridSkeleton background="bg-white" />}>
        <CategoryGrid />
      </Suspense>
      <Suspense fallback={<GridSkeleton background="bg-cream" />}>
        <NewArrivals />
      </Suspense>
      <PromoBanner />
      <Suspense fallback={<GridSkeleton background="bg-white" />}>
        <BestSellers />
      </Suspense>
      <SocialProof />
      <LocationMap />
    </>
  );
}
