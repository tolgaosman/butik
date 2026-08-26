"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiMutate } from "./api";
import { useAuth } from "./auth";
import { toast } from "./toast";
import { getProductDetail, type Product } from "./products";

const STORAGE_KEY = "sevgi-butik:favorites";

function readLocalFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalFavorites(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // localStorage unavailable — favorites just won't persist across visits
  }
}

type FavoritesContextValue = {
  slugs: Set<string>;
  products: Product[];
  isLoading: boolean;
  isFavorite: (slug: string) => boolean;
  toggle: (product: Product) => Promise<boolean>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const merged = useRef(false);

  const loadServerFavorites = useCallback(async () => {
    const res = await fetch("/api/favorites", { credentials: "include", headers: { Accept: "application/json" } });
    if (!res.ok) return;
    const data: Product[] = await res.json();
    setProducts(data);
    setSlugs(new Set(data.map((p) => p.id)));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const local = readLocalFavorites();
      setSlugs(new Set(local));
      merged.current = false;
      setIsLoading(true);

      Promise.all(local.map((slug) => getProductDetail(slug)))
        .then((results) => setProducts(results.filter((p) => p !== undefined)))
        .finally(() => setIsLoading(false));

      return;
    }

    (async () => {
      if (!merged.current) {
        merged.current = true;
        const local = readLocalFavorites();
        if (local.length > 0) {
          await apiMutate("/favorites/merge", { method: "POST", body: JSON.stringify({ slugs: local }) }).catch(
            () => {},
          );
          writeLocalFavorites([]);
        }
      }
      await loadServerFavorites();
      setIsLoading(false);
    })();
  }, [user, authLoading, loadServerFavorites]);

  const isFavorite = useCallback((slug: string) => slugs.has(slug), [slugs]);

  const toggle = useCallback(
    async (product: Product): Promise<boolean> => {
      if (!user) {
        toast.error("Giriş Yapmalısınız", { description: "Favorilere eklemek için lütfen giriş yapın." });
        router.push("/hesabim");
        return false;
      }

      const slug = product.id;
      const wasFavorite = slugs.has(slug);
      const nextSlugs = new Set(slugs);
      wasFavorite ? nextSlugs.delete(slug) : nextSlugs.add(slug);
      setSlugs(nextSlugs);

      if (wasFavorite) {
        toast.info("Favorilerden çıkarıldı", { description: product.name });
      } else {
        toast.success("Favorilere eklendi", { description: product.name });
      }

      try {
        if (wasFavorite) {
          await apiMutate(`/favorites/${slug}`, { method: "DELETE" });
        } else {
          await apiMutate("/favorites", { method: "POST", body: JSON.stringify({ product_slug: slug }) });
        }
        return true;
      } catch (err) {
        setSlugs(slugs); // revert on failure
        toast.error("İşlem gerçekleştirilemedi", { description: "Lütfen tekrar deneyin." });
        return false;
      }
    },
    [slugs, user, router],
  );

  return (
    <FavoritesContext.Provider value={{ slugs, products, isLoading, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
