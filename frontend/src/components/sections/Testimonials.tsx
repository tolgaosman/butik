import { Star, Quote } from "lucide-react";
import { business, googleReviews } from "@/lib/business";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <section className="bg-cream/40 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-medium tracking-[0.25em] text-olive">GOOGLE YORUMLARI</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">
            Müşterilerimiz Ne Diyor
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-ink-soft">
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < business.rating ? "fill-gold text-gold" : "fill-sand text-sand"}
                />
              ))}
            </div>
            <span>
              {business.rating}/5 · {business.reviewCount} Google yorumu
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {googleReviews.map((review, i) => (
            <Reveal key={review.author} delay={i * 80}>
              <div className="relative flex h-full flex-col gap-4 rounded-sm border border-sand bg-white p-6 shadow-sm">
                <Quote className="text-sand" size={28} />
                <div className="flex" aria-hidden>
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                {review.text && <p className="text-sm text-ink-soft">{review.text}</p>}
                <div className="mt-auto pt-2">
                  <p className="text-sm font-medium text-ink">{review.author}</p>
                  <p className="text-xs text-ink-soft">Google yorumları · {review.timeAgo}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
