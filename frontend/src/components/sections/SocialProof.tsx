"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { business, googleReviews } from "@/lib/business";
import { MotionReveal } from "@/components/ui/MotionReveal";
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
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <MotionReveal>
          <div className="flex justify-center" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={18}
                className={i < business.rating ? "fill-gold text-gold" : "fill-sand text-sand"}
              />
            ))}
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {business.rating}/5 Google Puanı
          </p>
          <div className="relative mt-4 h-16 sm:h-8 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="absolute text-sm text-ink-soft w-full px-2"
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
