"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiMutate, ApiError } from "./api";

export type CartItem = {
  id: number;
  productId: string;
  name: string;
  image: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  stock: number;
};

export type Cart = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  shipping: number;
  total: number;
};

const EMPTY_CART: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  freeShippingThreshold: 2500,
  freeShippingRemaining: 2500,
  shipping: 0,
  total: 0,
};

type CartContextValue = {
  cart: Cart;
  isLoading: boolean;
  addItem: (productSlug: string, size: string | null, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { credentials: "include", headers: { Accept: "application/json" } });
      if (res.ok) setCart(await res.json());
    } catch {
      // keep last known cart state on transient failure
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (productSlug: string, size: string | null, quantity: number) => {
    const previous = cart;
    const data = await apiMutate<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ product_slug: productSlug, size, quantity }),
    }).catch((err) => {
      setCart(previous);
      throw err;
    });
    setCart(data);
  }, [cart]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    const previous = cart;
    setCart({
      ...cart,
      items: cart.items.map((i) => (i.id === itemId ? { ...i, quantity, lineTotal: i.unitPrice * quantity } : i)),
    });
    try {
      const data = await apiMutate<Cart>(`/cart/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      });
      setCart(data);
    } catch (err) {
      setCart(previous);
      throw err;
    }
  }, [cart]);

  const removeItem = useCallback(async (itemId: number) => {
    const previous = cart;
    setCart({ ...cart, items: cart.items.filter((i) => i.id !== itemId) });
    try {
      const data = await apiMutate<Cart>(`/cart/items/${itemId}`, { method: "DELETE" });
      setCart(data);
    } catch (err) {
      setCart(previous);
      throw err;
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, updateQuantity, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { ApiError };
