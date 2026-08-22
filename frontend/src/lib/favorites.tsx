"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { apiMutate } from "./api";
import { useAuth } from "./auth";
import type { Product } from "./products";

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
  toggle: (product: Pick<Product, "id">) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
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
      setProducts([]);
      setIsLoading(false);
      merged.current = false;
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
    async (product: Pick<Product, "id">) => {
      const slug = product.id;
      const wasFavorite = slugs.has(slug);
      const nextSlugs = new Set(slugs);
      wasFavorite ? nextSlugs.delete(slug) : nextSlugs.add(slug);
      setSlugs(nextSlugs);

      if (!user) {
        writeLocalFavorites([...nextSlugs]);
        return;
      }

      try {
        if (wasFavorite) {
          await apiMutate(`/favorites/${slug}`, { method: "DELETE" });
        } else {
          await apiMutate("/favorites", { method: "POST", body: JSON.stringify({ product_slug: slug }) });
        }
        await loadServerFavorites();
      } catch {
        setSlugs(slugs); // revert on failure
      }
    },
    [slugs, user, loadServerFavorites],
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
