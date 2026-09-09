"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1] }}
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 40c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm0 0c0 11.046-8.954 20-20 20S0 51.046 0 40s8.954-20 20-20 20 8.954 20 20zm0 0c11.046 0 20-8.954 20-20S51.046 0 40 0s-20 8.954-20 20 8.954 20 20 20zm0 0c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z' stroke='%23c7175a' stroke-width='1' fill='none' opacity='0.15'/%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 130% 120% at 50% 20%, black 50%, transparent 95%)",
        WebkitMaskImage: "radial-gradient(ellipse 130% 120% at 50% 20%, black 50%, transparent 95%)",
      }}
      aria-hidden
    />
  );
}
