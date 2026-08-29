import { apiGet } from "./api";

export type Review = {
  authorName: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
};

export type ReviewsMeta = {
  current_page: number;
  last_page: number;
  total: number;
};

export type ReviewsPage = {
  data: Review[];
  meta: ReviewsMeta;
};

// Laravel's paginate() puts current_page/last_page/total at the response root, not under `meta`.
type RawReviewsPage = ReviewsMeta & { data: Review[] };

const EMPTY_PAGE: ReviewsPage = { data: [], meta: { current_page: 1, last_page: 1, total: 0 } };

function toReviewsPage(raw: RawReviewsPage): ReviewsPage {
  const { data, current_page, last_page, total } = raw;
  return { data, meta: { current_page, last_page, total } };
}

export async function getProductReviews(slug: string, page = 1): Promise<ReviewsPage> {
  try {
    const data = await apiGet<RawReviewsPage>(`/products/${slug}/reviews?page=${page}`, {
      next: { revalidate: 300, tags: ["products", `product:${slug}`, `reviews:${slug}`] },
    });
    return data ? toReviewsPage(data) : EMPTY_PAGE;
  } catch {
    return EMPTY_PAGE;
  }
}
