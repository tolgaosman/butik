import { Star } from "lucide-react";

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`5 üzerinden ${rating} puan, ${reviewCount} değerlendirme`}>
      <div className="relative flex" aria-hidden>
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} className="text-ink/15" />
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${Math.max(0, Math.min(1, rating / 5)) * 100}%` }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} className="fill-gold text-gold" />
          ))}
        </div>
      </div>
      <span className="text-xs text-ink-soft">({reviewCount})</span>
    </div>
  );
}
