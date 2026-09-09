"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.32, 0.72, 0, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function HeroContent() {
  return (
    <motion.div
      className="flex flex-col items-center gap-[clamp(1rem,4vh,2rem)] text-center lg:items-start lg:text-left"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.h1
        variants={item}
        className="font-display text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[1.05] text-ink tracking-tight"
      >
        Az dolaş, <span className="italic text-olive">çok şık görün</span>
      </motion.h1>

      <motion.p variants={item} className="max-w-lg text-balance text-ink-soft/90 text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed">
        Kıbrıs&apos;ın her yerinden gelenler bizde aynı şeyi arıyor: Kadın, erkek ve çocuk koleksiyonlarımızda, giyince kendini iyi hissettiren ve dolapta durup kalmayacak parçalar.
      </motion.p>

      <motion.div variants={item} whileTap={{ scale: 0.97 }} className="mt-2">
        <Link
          href="#yeni-sezon"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-olive py-[clamp(0.6rem,1.5vh,0.85rem)] pl-7 pr-3.5 text-[0.95rem] font-medium text-cream shadow-xl shadow-olive/10 transition-all duration-500 ease-[var(--ease-organic)] hover:bg-olive-dark hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-olive/20"
        >
          <span className="relative z-10">Yeni gelenlere bak</span>
          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cream/20 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-organic)] group-hover:translate-x-1 group-hover:bg-cream/30">
            <ArrowRight size={15} />
          </span>
          <div className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
