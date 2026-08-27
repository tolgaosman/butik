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
      <div className="container-site py-6 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-1 justify-start">
            <Image src="/sevgiLogo-ink.png" alt="Sevgi Butik" width={180} height={65} className="h-8 w-auto object-contain" />
          </div>
          
          <div className="hidden flex-1 justify-center text-center sm:flex">
            <p className="text-sm text-ink-soft">{business.address}</p>
          </div>
          
          <div className="flex flex-1 items-center justify-center gap-4 sm:justify-end">
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

          <div className="flex-1 sm:hidden" aria-hidden />
        </div>
      </div>
    </footer>
  );
}
