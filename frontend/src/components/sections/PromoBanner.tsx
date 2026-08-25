"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function PromoBanner() {
  return (
    <section className="relative h-[26rem] overflow-hidden sm:h-[32rem]">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease }}
      >
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop"
          alt="Askıda dizilmiş özenle seçilmiş kıyafetler"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-ink/40" />

      <motion.div
        className="relative flex h-full flex-col items-center justify-center gap-5 px-5 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
      >
        <motion.p variants={item} className="text-xs font-medium tracking-[0.25em] text-cream">
          SEN OL, GÜZEL OL
        </motion.p>
        <motion.h2
          variants={item}
          className="max-w-2xl font-serif text-4xl font-medium leading-tight text-white sm:text-6xl"
        >
          Kendine Güven, En Güzel Kombinin
        </motion.h2>
        <motion.p variants={item} className="max-w-md text-white/85">
          Sizi harika hissettiren zamansız parçalar, her gün giyilmek için tasarlandı.
        </motion.p>
        <motion.div variants={item}>
          <Button href="/lookbook" variant="solid" className="bg-white text-ink hover:bg-cream">
            Alışverişe Başla
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
