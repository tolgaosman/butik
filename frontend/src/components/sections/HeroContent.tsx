"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export function HeroContent() {
  return (
    <motion.div
      className="mx-auto flex max-w-3xl flex-col items-center gap-[clamp(0.75rem,3vh,1.5rem)] px-5 pb-[clamp(0.75rem,4vh,2rem)] pt-[clamp(1.25rem,7.3vh,6rem)] text-center sm:px-10"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.h1
        variants={item}
        className="font-display text-[clamp(1.75rem,min(9vw,7vh),4.5rem)] font-semibold leading-[1.1] text-ink"
      >
        Az dolaş, <span className="italic text-olive">çok şık görün</span>
      </motion.h1>

      <motion.p variants={item} className="max-w-lg text-balance text-ink-soft">
        Kıbrıs&apos;ın her yerinden gelenler bizde aynı şeyi arıyor: giyince kendini iyi
        hissettiren, dolapta durup kalmayacak parçalar.
      </motion.p>

      <motion.div variants={item}>
        <Link
          href="#yeni-sezon"
          className="group inline-flex items-center gap-2.5 rounded-full bg-olive py-[clamp(0.5rem,1.5vh,0.75rem)] pl-6 pr-3 text-sm font-medium text-cream transition-all duration-300 ease-[var(--ease-organic)] hover:bg-olive-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-olive/20 active:translate-y-0"
        >
          Yeni gelenlere bak
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cream/20 transition-transform duration-300 ease-[var(--ease-organic)] group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
