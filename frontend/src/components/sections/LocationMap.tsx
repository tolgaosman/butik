import { MapPin, Navigation } from "lucide-react";
import { business } from "@/lib/business";

export function LocationMap() {
  const { lat, lng } = business.coords;
  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=tr&z=16&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapsQuery)}`;

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium tracking-[0.25em] text-olive">BİZİ ZİYARET EDİN</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">
            Kaliteli Giyimin Adresi
          </h2>
          <p className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 text-sm text-ink-soft">
            <MapPin size={16} className="shrink-0" />
            {business.address}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-sm border border-sand shadow-sm">
          <iframe
            src={embedSrc}
            title="Sevgi Butik konum haritası"
            className="h-[280px] w-full grayscale-[15%] sm:h-[360px] lg:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-olive px-4 py-3 text-xs font-medium uppercase tracking-wide text-cream shadow-lg transition-all duration-300 ease-[var(--ease-organic)] hover:-translate-y-0.5 hover:bg-olive-dark sm:bottom-5 sm:right-5 sm:px-5"
          >
            <Navigation size={15} />
            Yol Tarifi Al
          </a>
        </div>
      </div>
    </section>
  );
}
