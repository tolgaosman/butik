import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, Navigation } from "lucide-react";
import { business } from "@/lib/business";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "İletişim | Sevgi Butik",
  description: "Sevgi Butik ile iletişime geçin — adres, telefon ve çalışma saatleri.",
};

export default function ContactPage() {
  const { lat, lng } = business.coords;
  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=tr&z=16&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapsQuery)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "İletişim" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">İletişim</h1>
      <p className="mt-3 max-w-lg text-sm text-ink-soft">
        Sorularınız, siparişleriniz veya özel talepleriniz için bize her zaman ulaşabilirsiniz.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 lg:grid-cols-[380px_1fr] lg:gap-10">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-olive" />
            <div>
              <p className="text-sm font-medium text-ink">Adres</p>
              <p className="text-sm text-ink-soft">{business.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="mt-0.5 shrink-0 text-olive" />
            <div>
              <p className="text-sm font-medium text-ink">Telefon</p>
              <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="text-sm text-ink-soft hover:text-olive">
                {business.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="mt-0.5 shrink-0 text-olive" />
            <div>
              <p className="text-sm font-medium text-ink">E-posta</p>
              <a href={`mailto:${business.email}`} className="text-sm text-ink-soft hover:text-olive">
                {business.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="mt-0.5 shrink-0 text-olive" />
            <div>
              <p className="text-sm font-medium text-ink">Çalışma Saatleri</p>
              <dl className="mt-1 space-y-0.5">
                {business.hours.map((h) => (
                  <div key={h.day} className="flex gap-3 text-sm text-ink-soft">
                    <dt className="w-24 shrink-0">{h.day}</dt>
                    <dd>{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-olive px-5 py-3 text-xs font-medium uppercase tracking-wide text-cream transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-0.5 hover:bg-olive-dark"
          >
            <Navigation size={15} />
            Yol Tarifi Al
          </a>
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-sm border border-sand shadow-sm sm:min-h-[360px]">
          <iframe
            src={embedSrc}
            title="Sevgi Butik konum haritası"
            className="h-full min-h-[280px] w-full grayscale-[15%] sm:min-h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mt-12 max-w-2xl sm:mt-16">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Bize Yazın</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Aşağıdaki formu doldurarak sorularınızı iletebilirsiniz.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
