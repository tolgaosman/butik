import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, Navigation, MessageCircle } from "lucide-react";
import { business } from "@/lib/business";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/sections/ContactForm";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/ui/MotionReveal";

export const metadata: Metadata = {
  title: "İletişim | Sevgi Butik",
  description: "Sevgi Butik ile iletişime geçin — adres, telefon ve çalışma saatleri.",
};



const dayIndexMap = [6, 0, 1, 2, 3, 4, 5]; // JS getDay() (0=Sun) -> business.hours index (0=Mon)

export default function ContactPage() {
  const { lat, lng } = business.coords;
  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=tr&z=16&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapsQuery)}`;
  const todayIndex = dayIndexMap[new Date().getDay()];

  const quickContacts = [
    {
      icon: Phone,
      label: "Telefon",
      value: business.phone,
      href: `tel:${business.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Adres",
      value: business.address,
      href: directionsHref,
    },
    {
      icon: Navigation,
      label: "Yol Tarifi",
      value: "Haritada Açın",
      href: directionsHref,
    },
  ];

  return (
    <div className="container-site py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "İletişim" }]} />

      <MotionStagger className="mt-3">
        <MotionItem>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">İletişim</h1>
        </MotionItem>
        <MotionItem>
          <p className="mt-3 max-w-lg text-sm text-ink-soft">
            Sorularınız, siparişleriniz veya özel talepleriniz için bize her zaman ulaşabilirsiniz.
          </p>
        </MotionItem>

        {/* Hızlı temas kartları */}
        <MotionItem className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3">
          {quickContacts.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3.5 border border-sand bg-cream/40 p-4 transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-1 hover:border-olive hover:bg-cream hover:shadow-lg hover:shadow-olive/10"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-olive-dark transition-colors duration-300 ease-[var(--ease-organic)] group-hover:bg-olive group-hover:text-cream">
                <Icon size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-ink-soft">{label}</span>
                <span className="block truncate text-sm font-medium text-ink" title={value}>{value}</span>
              </span>
            </a>
          ))}
        </MotionItem>
      </MotionStagger>

      <div className="mt-12 grid grid-cols-1 gap-12 sm:mt-16 lg:grid-cols-[380px_1fr] lg:gap-16">
        {/* Sol Sütun: Çalışma Saatleri */}
        <MotionReveal>
          <div className="relative flex h-full flex-col overflow-hidden border border-sand bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5 sm:p-8">
            <div className="flex shrink-0 items-center gap-4 border-b border-sand pb-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">
                <Clock size={22} strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">Çalışma Saatleri</h2>
                <p className="text-xs text-ink-soft">Haftanın 6 günü hizmetinizdeyiz</p>
              </div>
            </div>

            <div className="mt-4 flex flex-1 flex-col">
              <dl className="flex flex-1 flex-col justify-between divide-y divide-sand/40">
                {business.hours.map((h, i) => {
                  const isToday = i === todayIndex;
                  return (
                    <div
                      key={h.day}
                      className={`group flex flex-1 items-center justify-between text-sm transition-colors duration-200 ${
                        isToday
                          ? "rounded-lg bg-olive px-4 text-white shadow-md shadow-olive/20"
                          : "px-2 hover:bg-cream"
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
          <div className="border border-sand bg-cream/30 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Bize Yazın</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Aşağıdaki formu doldurarak sorularınızı iletebilirsiniz.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Alt Bölüm: Büyük Harita */}
      <MotionReveal className="mt-12 sm:mt-16">
        <div className="relative min-h-[400px] w-full overflow-hidden rounded-sm border border-sand shadow-sm sm:min-h-[500px]">
          <iframe
            src={embedSrc}
            title="Sevgi Butik konum haritası"
            className="h-full min-h-[400px] w-full grayscale-[15%] sm:min-h-[500px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 border border-sand bg-cream/90 p-4 shadow-lg backdrop-blur-sm sm:right-auto sm:max-w-sm">
            <p className="flex items-center gap-2 text-sm text-ink">
              <MapPin size={16} className="shrink-0 text-olive" />
              <span className="truncate">{business.address}</span>
            </p>
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-medium uppercase tracking-wide text-olive-dark underline decoration-olive/40 underline-offset-4 transition-colors duration-200 hover:text-olive"
            >
              Yol Tarifi
            </a>
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}
