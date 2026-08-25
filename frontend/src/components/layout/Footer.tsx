import { Instagram, Facebook } from "lucide-react";
import { business } from "@/lib/business";

export function Footer() {
  return (
    <footer className="bg-olive text-cream/70">
      <div className="container-site">
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <span className="font-display text-sm font-semibold tracking-[0.2em] text-cream">
            SEVGİ BUTİK
          </span>

          <div className="text-center text-[0.65rem] text-cream/50 sm:text-left">
            © {new Date().getFullYear()} Sevgi Butik. Tüm hakları saklıdır.
          </div>

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
      </div>
    </footer>
  );
}
