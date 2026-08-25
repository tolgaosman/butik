"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Facebook } from "lucide-react";
import { business } from "@/lib/business";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="container-site py-14 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <Image src="/sevgiLogo-ink.png" alt="Sevgi Butik" width={180} height={65} className="h-11 w-auto object-contain" />
          <p className="mt-4 max-w-[26ch] text-sm text-ink-soft">{business.address}</p>
          <div className="mt-5 flex items-center justify-center gap-4">
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="-m-2 p-2 text-ink-soft transition-colors duration-200 hover:text-olive"
            >
              <Instagram size={18} />
            </a>
            <a
              href={business.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="-m-2 p-2 text-ink-soft transition-colors duration-200 hover:text-olive"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-[0.7rem] text-ink-soft sm:mt-14">
          © {new Date().getFullYear()} Sevgi Butik. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
