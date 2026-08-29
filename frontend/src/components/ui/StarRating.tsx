import { Star } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
  size = 14,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  const label =
    reviewCount !== undefined
      ? `5 üzerinden ${rating} puan, ${reviewCount} değerlendirme`
      : `5 üzerinden ${rating} puan`;

  return (
    <div className="flex items-center gap-1.5" aria-label={label}>
      <div className="relative flex" aria-hidden>
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={size} className="text-ink/15" />
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${Math.max(0, Math.min(1, rating / 5)) * 100}%` }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={size} className="fill-gold text-gold" />
          ))}
        </div>
      </div>
      {reviewCount !== undefined && <span className="text-xs text-ink-soft">({reviewCount})</span>}
    </div>
  );
}
