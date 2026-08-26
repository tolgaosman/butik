import { apiGet } from "./api";

export type Category = {
  id: string;
  name: string;
  itemCount: number;
  href: string;
  image: string;
  subcategories?: Category[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  discountPercent?: number;
  originalPrice?: number;
  gender?: 'kadin' | 'erkek' | 'unisex';
  categories?: string[];
};

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await apiGet<Category[]>("/categories", {
      next: { revalidate: 3600, tags: ["categories"] },
    });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const data = await apiGet<Product[]>("/products?is_new=1&limit=10", {
      next: { revalidate: 600, tags: ["products"] },
    });
    return data ?? [];
  } catch {
    return [];
  }
}

export type HomepageData = {
  hero_products: Product[];
  new_arrivals: Product[];
  promo_banner_url: string;
};

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const data = await apiGet<HomepageData>("/homepage", {
      next: { revalidate: 60, tags: ["homepage", "products"] },
    });
    
    if (data) return data;
  } catch {}
  
  return { hero_products: [], new_arrivals: [], promo_banner_url: "" };
}

export async function getBestSellers(): Promise<Product[]> {
  try {
    const data = await apiGet<Product[]>("/products?category=cok-satanlar&limit=4", {
      next: { revalidate: 600, tags: ["products"] },
    });
    return data ?? [];
  } catch {
    return [];
  }
}

export type ProductVariant = {
  id: number;
  size: string | null;
  stock: number;
  isActive: boolean;
};

export type ProductDetail = Product & {
  description: string;
  variants: ProductVariant[];
};

export async function getProductById(id: string): Promise<Product | undefined> {
  return getProductDetail(id);
}

export async function getProductDetail(id: string): Promise<ProductDetail | undefined> {
  try {
    return await apiGet<ProductDetail>(`/products/${id}`, {
      next: { revalidate: 600, tags: ["products", `product:${id}`] },
    });
  } catch {
    return undefined;
  }
}

export async function getProductsByCategory(
  categorySlug: string,
  subcategorySlug?: string,
): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ category: categorySlug });
    if (subcategorySlug) params.set("subcategory", subcategorySlug);

    const data = await apiGet<Product[]>(`/products?${params.toString()}`, {
      next: { revalidate: 600, tags: ["products"] },
    });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  try {
    const data = await apiGet<Product[]>(`/products/${productId}/related?limit=${limit}`, {
      next: { revalidate: 600, tags: ["products"] },
    });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAllProductIds(): Promise<string[]> {
  try {
    const data = await apiGet<string[]>("/products/slugs", { cache: "no-store" });
    return data ?? [];
  } catch {
    return [];
  }
}
