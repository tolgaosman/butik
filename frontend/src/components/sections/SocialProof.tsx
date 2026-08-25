"use client";

import { useState, useEffect } from "react";
import { business, googleReviews } from "@/lib/business";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { StarRating } from "@/components/ui/StarRating";
import { AnimatePresence, motion } from "framer-motion";

export function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % googleReviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="container-site max-w-2xl text-center">
        <MotionReveal>
          <div className="flex justify-center">
            <StarRating rating={business.rating} reviewCount={business.reviewCount} />
          </div>
          <p className="mt-3 font-serif text-2xl font-medium text-ink sm:text-3xl">
            {business.rating}/5 Google Puanı
          </p>
          <div className="relative mt-4 flex min-h-16 justify-center sm:min-h-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full px-2 text-sm text-ink-soft"
              >
                {googleReviews[currentIndex].text ? (
                  <>
                    &ldquo;{googleReviews[currentIndex].text}&rdquo;{" "}
                    <span className="text-ink-soft/70">— {googleReviews[currentIndex].author}</span>
                  </>
                ) : (
                  <span className="text-ink-soft/70">{googleReviews[currentIndex].author} tarafından değerlendirildi</span>
                )}
              </motion.p>
            </AnimatePresence>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
