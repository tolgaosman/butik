"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Send } from "lucide-react";
import type { StoreSettings } from "@/lib/settings";
import { footerLinks } from "@/lib/nav";
import { apiMutate, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiMutate("/newsletter", { method: "POST", body: JSON.stringify({ email }) });
      setEmail("");
      toast.success("Bültenimize hoş geldiniz", { description: "Yeni ürün ve kampanyalardan ilk siz haberdar olacaksınız." });
    } catch (err) {
      toast.error("Kayıt yapılamadı", {
        description: err instanceof ApiError ? err.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        aria-label="E-posta adresiniz"
        className="w-full border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-olive"
      />
      <button
        type="submit"
        disabled={loading}
        aria-label="Bültene abone ol"
        className="flex shrink-0 items-center justify-center rounded-full bg-olive px-4 text-white transition-colors duration-200 hover:bg-olive-dark disabled:opacity-60"
      >
        <Send size={16} />
      </button>
    </form>
  );
}

export function Footer({ settings }: { settings: StoreSettings }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="container-site py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/sevgiLogo-ink.png"
              alt="Sevgi Butik"
              width={180}
              height={65}
              className="h-9 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">{settings.address}</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="-m-2 p-2 text-ink-soft transition-colors duration-200 hover:text-olive"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="-m-2 p-2 text-ink-soft transition-colors duration-200 hover:text-olive"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="font-serif text-sm font-semibold text-ink">Mağaza</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.magaza.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft transition-colors duration-200 hover:text-olive">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-serif text-sm font-semibold text-ink">Müşteri Hizmetleri</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.musteriHizmetleri.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft transition-colors duration-200 hover:text-olive">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-serif text-sm font-semibold text-ink">Bültenimize Katılın</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Yeni ürünler ve özel kampanyalar için e-posta listemize katılın.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-ink-soft sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {settings.name}. Tüm hakları saklıdır.</p>
          <p>{settings.phone}</p>
        </div>
      </div>
    </footer>
  );
}
