import type { Metadata } from "next";
import { MapPin, Phone, Clock, Instagram, Facebook, Mail } from "lucide-react";
import { business } from "@/lib/business";
import { getStoreSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/sections/ContactForm";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

export const metadata: Metadata = {
  title: "İletişim | Sevgi Butik",
  description: "Sevgi Butik ile iletişime geçin — adres, telefon ve çalışma saatleri.",
};

// Opening hours aren't part of the admin settings form yet — kept from business.ts.
const dayIndexMap = [6, 0, 1, 2, 3, 4, 5]; // JS getDay() (0=Sun) -> business.hours index (0=Mon)

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.mapsQuery)}`;
  const todayIndex = dayIndexMap[new Date().getDay()];



  return (
    <div className="container-site py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "İletişim" }]} />

      <MotionStagger className="mt-3">
        <MotionItem>
          <h1 className="font-serif text-4xl font-medium text-ink sm:text-5xl">İletişim</h1>
        </MotionItem>
        <MotionItem>
          <p className="mt-3 max-w-lg text-sm text-ink-soft">
            Sorularınız, siparişleriniz veya özel talepleriniz için bize her zaman ulaşabilirsiniz.
          </p>
        </MotionItem>

        {/* Hızlı temas kartları */}
        <MotionItem className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3">
          {/* Telefon */}
          <a
            href={`tel:${settings.phone.replace(/\s/g, "")}`}
            className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-cream/40 p-4 transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-1 hover:border-olive hover:bg-cream hover:shadow-lg hover:shadow-olive/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-olive-dark transition-colors duration-300 ease-[var(--ease-organic)] group-hover:bg-olive group-hover:text-cream">
              <Phone size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink-soft">Telefon</span>
              <span className="block truncate text-sm font-medium text-ink" title={settings.phone}>{settings.phone}</span>
            </span>
          </a>

          {/* E-posta */}
          <a
            href={`mailto:${settings.email}`}
            className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-cream/40 p-4 transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-1 hover:border-olive hover:bg-cream hover:shadow-lg hover:shadow-olive/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-olive-dark transition-colors duration-300 ease-[var(--ease-organic)] group-hover:bg-olive group-hover:text-cream">
              <Mail size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink-soft">E-posta</span>
              <span className="block truncate text-sm font-medium text-ink" title={settings.email}>{settings.email}</span>
            </span>
          </a>

          {/* 2. Sütun: Adres */}
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-cream/40 p-4 transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-1 hover:border-olive hover:bg-cream hover:shadow-lg hover:shadow-olive/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-olive-dark transition-colors duration-300 ease-[var(--ease-organic)] group-hover:bg-olive group-hover:text-cream">
              <MapPin size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink-soft">Adres</span>
              <span className="block text-sm font-medium text-ink leading-tight" title={settings.address}>{settings.address}</span>
            </span>
          </a>
          {/* Instagram */}
          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-cream/40 p-4 transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-1 hover:border-olive hover:bg-cream hover:shadow-lg hover:shadow-olive/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-olive-dark transition-colors duration-300 ease-[var(--ease-organic)] group-hover:bg-olive group-hover:text-cream">
              <Instagram size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink-soft">Instagram</span>
              <span className="block truncate text-sm font-medium text-ink transition-colors duration-200 group-hover:text-ink">Takip Et</span>
            </span>
          </a>

          {/* Facebook */}
          <a
            href={settings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-cream/40 p-4 transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-1 hover:border-olive hover:bg-cream hover:shadow-lg hover:shadow-olive/10"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-olive-dark transition-colors duration-300 ease-[var(--ease-organic)] group-hover:bg-olive group-hover:text-cream">
              <Facebook size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink-soft">Facebook</span>
              <span className="block truncate text-sm font-medium text-ink transition-colors duration-200 group-hover:text-ink">Takip Et</span>
            </span>
          </a>
        </MotionItem>
      </MotionStagger>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-16 sm:gap-12 lg:grid-cols-[380px_1fr] lg:gap-16">
        {/* Sol Sütun: Çalışma Saatleri */}
        <MotionReveal>
          <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5 sm:p-8">
            <div className="flex shrink-0 items-center gap-4 border-b border-border pb-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                <Clock size={22} strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="font-serif text-2xl font-medium text-ink sm:text-2xl">Çalışma Saatleri</h2>
                <p className="text-xs text-ink-soft">Haftanın 6 günü hizmetinizdeyiz</p>
              </div>
            </div>

            <div className="mt-4 flex flex-1 flex-col">
              <dl className="flex flex-1 flex-col justify-between divide-y divide-border/40">
                {business.hours.map((h, i) => {
                  const isToday = i === todayIndex;
                  return (
                    <div
                      key={h.day}
                      className={`group flex flex-1 items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200 sm:py-2 ${
                        isToday
                          ? "bg-olive text-white shadow-md shadow-olive/20"
                          : "hover:bg-cream"
                      }`}
                    >
                      <dt className="flex items-center gap-2">
                        <span className={`w-[72px] font-medium sm:w-24 ${isToday ? "text-white" : "text-ink"}`}>
                          {h.day}
                        </span>
                      </dt>
                      <dd className={`whitespace-nowrap font-medium text-right ${isToday ? "text-white" : "text-ink-soft group-hover:text-ink"}`}>
                        {h.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </MotionReveal>

        {/* Sağ Sütun: Form */}
        <MotionReveal delay={100}>
          <div className="rounded-3xl border border-border/70 bg-cream/30 p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">Bize Yazın</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Aşağıdaki formu doldurarak sorularınızı iletebilirsiniz.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </MotionReveal>
      </div>

    </div>
  );
}
