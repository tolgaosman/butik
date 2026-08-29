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

const EMPTY_PAGE: ReviewsPage = { data: [], meta: { current_page: 1, last_page: 1, total: 0 } };

export async function getProductReviews(slug: string, page = 1): Promise<ReviewsPage> {
  try {
    const data = await apiGet<ReviewsPage>(`/products/${slug}/reviews?page=${page}`, {
      next: { revalidate: 300, tags: ["products", `product:${slug}`, `reviews:${slug}`] },
    });
    return data ?? EMPTY_PAGE;
  } catch {
    return EMPTY_PAGE;
  }
}
