"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { apiGet, apiMutate, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { toast } from "@/lib/toast";
import type { Review, ReviewsPage, ReviewsMeta } from "@/lib/reviews";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

type Props = {
  productSlug: string;
  initialReviews: Review[];
  initialMeta: ReviewsMeta;
};

export function ProductReviews({ productSlug, initialReviews, initialMeta }: Props) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [meta, setMeta] = useState(initialMeta);
  const [loadingMore, setLoadingMore] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = meta.current_page + 1;
      const res = await apiGet<ReviewsPage>(`/products/${productSlug}/reviews?page=${nextPage}`);
      if (res) {
        setReviews((prev) => [...prev, ...res.data]);
        setMeta(res.meta);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiMutate(`/products/${productSlug}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, title: title || undefined, body: body || undefined }),
      });
      setSubmitted(true);
      setFormOpen(false);
      toast.success("Değerlendirmeniz gönderildi", { description: "Onaylandıktan sonra yayınlanacak." });
    } catch (err) {
      toast.error("Değerlendirme gönderilemedi", {
        description: err instanceof ApiError ? err.message : "Lütfen tekrar deneyin.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 sm:mt-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
          Değerlendirmeler {meta.total > 0 && <span className="text-ink-soft">({meta.total})</span>}
        </h2>
        {user && !submitted && (
          <Button variant="outline" onClick={() => setFormOpen((v) => !v)}>
            {formOpen ? "Vazgeç" : "Değerlendirme Yaz"}
          </Button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 border border-border p-6">
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Puanınız</p>
            <div className="flex gap-1" role="radiogroup" aria-label="Puan">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={n === rating}
                  onClick={() => setRating(n)}
                  aria-label={`${n} yıldız`}
                  className="p-0.5"
                >
                  <Star size={22} className={n <= rating ? "fill-gold text-gold" : "text-border"} />
                </button>
              ))}
            </div>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlık (opsiyonel)"
            maxLength={255}
            className="w-full border border-border px-4 py-2.5 text-sm text-ink transition-colors duration-200 focus:border-olive focus-visible:outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Yorumunuz (opsiyonel)"
            rows={4}
            maxLength={2000}
            className="w-full border border-border px-4 py-2.5 text-sm text-ink transition-colors duration-200 focus:border-olive focus-visible:outline-none"
          />
          <Button type="submit" variant="solid" loading={submitting}>
            Gönder
          </Button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">Bu ürün için henüz onaylanmış bir değerlendirme yok.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border border-t border-border">
          {reviews.map((review, i) => (
            <li key={i} className="py-5">
              <div className="flex items-center justify-between gap-4">
                <StarRating rating={review.rating} />
                <span className="text-xs text-ink-soft">{dateFormatter.format(new Date(review.createdAt))}</span>
              </div>
              {review.title && <p className="mt-2 text-sm font-medium text-ink">{review.title}</p>}
              {review.body && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{review.body}</p>}
              <p className="mt-2 text-xs font-medium text-ink-soft">{review.authorName}</p>
            </li>
          ))}
        </ul>
      )}

      {meta.current_page < meta.last_page && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={loadMore} loading={loadingMore}>
            Daha Fazla Yorum Yükle
          </Button>
        </div>
      )}
    </section>
  );
}
