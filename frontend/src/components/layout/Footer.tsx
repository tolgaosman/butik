"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook } from "lucide-react";
import type { StoreSettings } from "@/lib/settings";
import { footerLinks } from "@/lib/nav";

export function Footer({ settings }: { settings: StoreSettings }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto bg-ink text-surface overflow-hidden">
      <div className="container-site relative py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col">
            <Image
              src="/sevgiLogo-ink.png"
              alt="Sevgi Butik"
              width={180}
              height={65}
              className="h-10 w-auto object-contain object-left drop-shadow-md brightness-0 invert"
            />
            <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-white/70">{settings.address}</p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-ink hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-ink hover:scale-110"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="font-serif text-[1.1rem] font-medium tracking-wide text-white">Mağaza</p>
            <ul className="mt-6 space-y-3">
              {footerLinks.magaza.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block text-[0.95rem] text-white/70 transition-colors duration-300 hover:text-white hover:translate-x-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-serif text-[1.1rem] font-medium tracking-wide text-white">Müşteri Hizmetleri</p>
            <ul className="mt-6 space-y-3">
              {footerLinks.musteriHizmetleri.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block text-[0.95rem] text-white/70 transition-colors duration-300 hover:text-white hover:translate-x-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="relative z-10 mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {settings.name}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <span>{settings.phone}</span>
            <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
