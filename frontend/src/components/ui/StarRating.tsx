import { Star } from "lucide-react";

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`5 üzerinden ${rating} puan, ${reviewCount} değerlendirme`}>
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? "fill-gold text-gold" : "fill-sand text-sand"}
          />
        ))}
      </div>
      <span className="text-xs text-ink-soft">({reviewCount})</span>
    </div>
  );
}
