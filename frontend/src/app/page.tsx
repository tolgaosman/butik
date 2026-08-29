import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { BestSellers } from "@/components/sections/BestSellers";
import { SocialProof } from "@/components/sections/SocialProof";
import { LocationMap } from "@/components/sections/LocationMap";
import { GridSkeleton } from "@/components/ui/GridSkeleton";

import { getHomepageData } from "@/lib/products";

export default async function Home() {
  const homepageData = await getHomepageData();
  
  return (
    <>
      <Hero products={homepageData.hero_products} />
      <Suspense fallback={<GridSkeleton background="bg-cream" />}>
        <NewArrivals products={homepageData.new_arrivals} />
      </Suspense>
      <Suspense fallback={<GridSkeleton background="bg-white" />}>
        <CategoryGrid />
      </Suspense>
      <PromoBanner imageUrl={homepageData.promo_banner_url} />
      <Suspense fallback={<GridSkeleton background="bg-white" />}>
        <BestSellers />
      </Suspense>
      <SocialProof />
      <Suspense fallback={<GridSkeleton background="bg-white" />}>
        <LocationMap />
      </Suspense>
    </>
  );
}
