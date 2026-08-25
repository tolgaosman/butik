import { MapPin, Navigation } from "lucide-react";
import { business } from "@/lib/business";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function LocationMap() {
  const { lat, lng } = business.coords;
  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=tr&z=16&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapsQuery)}`;

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="container-site">
        <SectionHeader eyebrow="BİZİ ZİYARET EDİN" title="Kaliteli Giyimin Adresi" align="center" />
        <p className="mx-auto -mt-4 mb-8 flex max-w-md items-center justify-center gap-2 text-sm text-ink-soft sm:mb-10">
          <MapPin size={16} className="shrink-0" />
          {business.address}
        </p>

        <MotionReveal>
          <div className="relative overflow-hidden border border-border">
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
        </MotionReveal>
      </div>
    </section>
  );
}
