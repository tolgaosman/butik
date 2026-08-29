import { apiGetAuthed } from "@/lib/api";
import type { AdminReview } from "@/lib/admin";
import { ReviewsTable } from "./ReviewsTable";

async function loadReviews(): Promise<AdminReview[]> {
  try {
    return (await apiGetAuthed<AdminReview[]>("/admin/reviews?status=pending")) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminReviewsPage() {
  const reviews = await loadReviews();

  return <ReviewsTable initialReviews={reviews} />;
}
