"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { Search, User, Phone, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { primaryNav } from "@/lib/nav";
import { useCart } from "@/lib/cart";

export function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.itemCount;
  const reduceMotion = useReducedMotion();
  const lastY = useRef(0);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    if (open || menuOpen || reduceMotion) {
      setHidden(false);
      lastY.current = y;
      return;
    }
    const goingDown = y > lastY.current;
    setHidden(y > 120 && goingDown);
    lastY.current = y;
  });

  function closeDrawer() {
    setOpen(false);
    setOpenSection(null);
  }

  return (
    <motion.header
      className="sticky top-0 z-40 bg-olive text-cream"
      onMouseLeave={() => setMenuOpen(false)}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-site flex items-center justify-between py-[clamp(0.5rem,1.6vh,1rem)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Menüyü aç"
          className="-m-2 p-2 text-cream lg:hidden"
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="text-center leading-tight lg:text-left" onClick={() => setMenuOpen(false)}>
          <span className="block font-display text-[clamp(1.35rem,3vh,1.875rem)] font-semibold tracking-[0.15em] text-cream">SEVGİ</span>
          <span className="block text-[clamp(0.55rem,1vh,0.65rem)] tracking-[0.35em] text-cream/70">BUTİK</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setMenuOpen(true)}
              onFocus={() => setMenuOpen(true)}
              onClick={() => setMenuOpen(false)}
              className="group relative py-1 text-xs font-medium tracking-wide text-cream/80 transition-colors duration-300 hover:text-cream"
            >
              {item.label.toLocaleUpperCase("tr-TR")}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-cream transition-transform duration-300 ease-[var(--ease-organic)] group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 text-cream sm:gap-2">
          <button
            type="button"
            aria-label="Ara"
            onClick={() => setMenuOpen(false)}
            className="hidden p-2.5 transition-transform duration-200 hover:scale-110 sm:block"
          >
            <Search size={19} />
          </button>
          <Link
            href="/hesabim"
            aria-label="Hesabım"
            onClick={() => setMenuOpen(false)}
            className="hidden p-2.5 transition-transform duration-200 hover:scale-110 sm:block"
          >
            <User size={19} />
          </Link>
          <Link
            href="/iletisim"
            aria-label="İletişim"
            onClick={() => setMenuOpen(false)}
            className="p-2.5 transition-transform duration-200 hover:scale-110"
          >
            <Phone size={19} />
          </Link>
          <Link
            href="/favoriler"
            aria-label="Favorilerim"
            onClick={() => setMenuOpen(false)}
            className="p-2.5 transition-transform duration-200 hover:scale-110"
          >
            <Heart size={19} />
          </Link>
          <Link
            href="/sepet"
            aria-label="Sepetim"
            onClick={() => setMenuOpen(false)}
            className="relative p-2.5 transition-transform duration-200 hover:scale-110"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cream text-[0.6rem] font-medium text-olive">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div
        className={`absolute inset-x-0 top-full hidden overflow-hidden bg-white shadow-xl transition-[grid-template-rows] duration-300 ease-[var(--ease-organic)] lg:grid ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="container-site grid grid-cols-8 gap-8 py-10">
            {primaryNav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-lg font-medium text-ink transition-colors duration-200 hover:text-olive"
                >
                  {item.label}
                </Link>
                <ul className="mt-4 space-y-2.5">
                  {item.columns.flatMap((column) => column.items).map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-ink/70 transition-colors duration-200 hover:text-olive"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-olive shadow-xl transition-transform duration-300 ease-[var(--ease-organic)] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-display text-xl font-semibold tracking-widest text-cream">SEVGİ</span>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Menüyü kapat"
              className="-m-2 p-2 text-cream"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8">
            <ul className="divide-y divide-cream/15">
              {primaryNav.map((item) => {
                const subItems = item.columns.flatMap((column) => column.items);
                const expanded = openSection === item.href;

                return (
                  <li key={item.href}>
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={item.href}
                        onClick={closeDrawer}
                        className="flex-1 py-3.5 text-sm font-medium tracking-wide text-cream/90 transition-colors duration-200 hover:text-cream"
                      >
                        {item.label.toLocaleUpperCase("tr-TR")}
                      </Link>
                      {subItems.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setOpenSection(expanded ? null : item.href)}
                          aria-expanded={expanded}
                          aria-label={`${item.label} alt kategorilerini ${expanded ? "gizle" : "göster"}`}
                          className="-mr-2 p-2 text-cream/70 transition-colors duration-200 hover:text-cream"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ease-[var(--ease-organic)] ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-organic)] ${
                        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <ul className="min-h-0 overflow-hidden">
                        {subItems.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={closeDrawer}
                              className="block py-2.5 pl-3 text-sm text-cream/70 transition-colors duration-200 hover:text-cream"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                        <li className="pb-2" aria-hidden />
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-1 border-t border-cream/15 pt-4">
              <Link
                href="/hesabim"
                onClick={closeDrawer}
                className="block py-2.5 text-sm text-cream/80 transition-colors duration-200 hover:text-cream"
              >
                Hesabım
              </Link>
              <Link
                href="/iletisim"
                onClick={closeDrawer}
                className="block py-2.5 text-sm text-cream/80 transition-colors duration-200 hover:text-cream"
              >
                İletişim
              </Link>
              <Link
                href="/favoriler"
                onClick={closeDrawer}
                className="block py-2.5 text-sm text-cream/80 transition-colors duration-200 hover:text-cream"
              >
                Favorilerim
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
