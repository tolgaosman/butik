import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { business } from "@/lib/business";
import { footerLinks } from "@/lib/nav";

const columns = [
  { title: "Mağaza", items: footerLinks.magaza },
  { title: "Yardım", items: footerLinks.musteriHizmetleri },
  { title: "Kurumsal", items: footerLinks.hakkimizda },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-olive bg-surface-alt">
      <div className="container-site py-14 sm:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-5 lg:gap-x-12">
          <div className="col-span-2 sm:col-span-2">
            <Image src="/sevgiLogo-ink.png" alt="Sevgi Butik" width={180} height={65} className="h-11 w-auto object-contain" />
            <p className="mt-4 max-w-[26ch] text-sm text-ink-soft">{business.address}</p>
            <div className="mt-5 flex items-center gap-4">
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

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-medium tracking-[0.2em] text-olive">{column.title.toLocaleUpperCase("tr-TR")}</p>
              <ul className="mt-4 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition-colors duration-200 hover:text-olive"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-[0.7rem] text-ink-soft sm:mt-14">
          © {new Date().getFullYear()} Sevgi Butik. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
