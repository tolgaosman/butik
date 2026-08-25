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
      className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 pb-8 pt-16 text-center sm:px-10 sm:pt-24"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.h1
        variants={item}
        className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-6xl lg:text-[4.5rem]"
      >
        Az dolaş, <span className="italic text-olive">çok şık görün</span>
      </motion.h1>

      <motion.p variants={item} className="max-w-lg text-balance text-ink-soft">
        Kıbrıs&apos;ın her yerinden gelenler bizde aynı şeyi arıyor: giyince kendini iyi
        hissettiren, dolapta durup kalmayacak parçalar.
      </motion.p>

      <motion.div variants={item}>
        <Link
          href="/yeni-gelenler"
          className="group inline-flex items-center gap-2.5 rounded-full bg-olive py-3 pl-6 pr-3 text-sm font-medium text-cream transition-all duration-300 ease-[var(--ease-organic)] hover:bg-olive-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-olive/20 active:translate-y-0"
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
