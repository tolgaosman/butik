"use client";

import { useState } from "react";
import { Star, Check, Trash2 } from "lucide-react";
import { apiGet, apiMutate, ApiError } from "@/lib/api";
import { revalidateStore } from "../actions";
import { iconButtonDanger, iconButtonNeutral } from "@/lib/adminIconButton";
import { toast } from "@/lib/toast";
import type { AdminReview } from "@/lib/admin";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" });

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} className={i < rating ? "fill-gold text-gold" : "text-border"} />
      ))}
    </div>
  );
}

export function ReviewsTable({ initialReviews }: { initialReviews: AdminReview[] }) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [status, setStatus] = useState<"pending" | "approved">("pending");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadStatus(next: "pending" | "approved") {
    setStatus(next);
    setLoading(true);
    try {
      const data = await apiGet<AdminReview[]>(`/admin/reviews?status=${next}`);
      setReviews(data ?? []);
    } catch {
      toast.error("Değerlendirmeler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(review: AdminReview) {
    setBusyId(review.id);
    try {
      await apiMutate(`/admin/reviews/${review.id}`, { method: "PUT", body: JSON.stringify({ is_approved: true }) });
      await revalidateStore();
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      toast.success("Değerlendirme onaylandı", { description: `${review.authorName} — ${review.productName}` });
    } catch (error) {
      toast.error("Onaylanamadı", { description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin." });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(review: AdminReview) {
    if (!window.confirm(`${review.authorName} tarafından yazılan değerlendirmeyi silmek istediğinize emin misiniz?`)) return;
    setBusyId(review.id);
    try {
      await apiMutate(`/admin/reviews/${review.id}`, { method: "DELETE" });
      await revalidateStore();
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      toast.success("Değerlendirme silindi");
    } catch (error) {
      toast.error("Silinemedi", { description: error instanceof ApiError ? error.message : "Lütfen tekrar deneyin." });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-medium text-ink">Değerlendirmeler</h1>
        <p className="mt-1 text-sm text-ink-soft">Müşteri ürün değerlendirmelerini onaylayın veya kaldırın.</p>
      </div>

      <div className="flex gap-2 border border-border bg-surface p-4 shadow-sm">
        {(["pending", "approved"] as const).map((s) => (
          <button
            key={s}
            onClick={() => loadStatus(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${
              status === s ? "bg-olive text-white" : "bg-cream text-ink-soft hover:text-ink"
            }`}
          >
            {s === "pending" ? "Onay Bekleyen" : "Onaylı"}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border border border-border bg-surface shadow-sm">
        {loading ? (
          <p className="py-12 text-center text-sm text-ink-soft">Yükleniyor...</p>
        ) : reviews.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-soft">
            {status === "pending" ? "Onay bekleyen değerlendirme yok." : "Onaylı değerlendirme yok."}
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-sm font-medium text-ink">{review.authorName}</span>
                  <span className="text-xs text-ink-soft">· {dateFormatter.format(new Date(review.createdAt))}</span>
                </div>
                <p className="text-xs text-ink-soft">
                  Ürün:{" "}
                  {review.productSlug ? (
                    <a href={`/urun/${review.productSlug}`} target="_blank" rel="noopener noreferrer" className="text-olive hover:underline">
                      {review.productName}
                    </a>
                  ) : (
                    review.productName ?? "—"
                  )}
                </p>
                {review.title && <p className="text-sm font-medium text-ink">{review.title}</p>}
                {review.body && <p className="text-sm leading-relaxed text-ink-soft">{review.body}</p>}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {status === "pending" && (
                  <button
                    onClick={() => handleApprove(review)}
                    disabled={busyId === review.id}
                    className={iconButtonNeutral}
                    title="Onayla"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review)}
                  disabled={busyId === review.id}
                  className={iconButtonDanger}
                  title="Sil"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
