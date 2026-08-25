import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { business } from "@/lib/business";

const links = [
  { label: "Mağaza", href: "/yeni-gelenler" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
  { label: "İade & Değişim", href: "/iade-ve-degisim" },
];

export function Footer() {
  return (
    <footer className="bg-olive text-cream/70">
      <div className="container-site">
        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <span className="font-display text-sm font-semibold tracking-[0.2em] text-cream">
            SEVGİ BUTİK
          </span>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-1 text-xs tracking-wide transition-colors duration-200 hover:text-cream"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="-m-2 p-2 transition-colors duration-200 hover:text-cream"
            >
              <Instagram size={16} />
            </a>
            <a
              href={business.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="-m-2 p-2 transition-colors duration-200 hover:text-cream"
            >
              <Facebook size={16} />
            </a>
          </div>
        </div>

        <div className="border-t border-cream/10 py-4 text-center text-[0.65rem] text-cream/40">
          © {new Date().getFullYear()} Sevgi Butik. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
