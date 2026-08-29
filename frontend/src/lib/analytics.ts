import type { Order } from "./orders";

/**
 * Thin wrapper over the Meta Pixel (fbq) and GA4 (gtag) globals — both are
 * optional (only defined when NEXT_PUBLIC_META_PIXEL_ID / NEXT_PUBLIC_GA_ID
 * are set and their scripts have loaded), so every call is a no-op until then.
 * Centralizing this is what makes ad spend measurable/optimizable — before
 * this, only PageView fired, so Meta/Google had no purchase signal to bid on.
 */
function fbq(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  fn?.("track", event, params);
}

function gtag(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  fn?.("event", event, params);
}

type TrackedProduct = { id: string; name: string; price: number };

export function trackViewContent(product: TrackedProduct): void {
  fbq("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "TRY",
  });
  gtag("view_item", {
    currency: "TRY",
    value: product.price,
    items: [{ item_id: product.id, item_name: product.name, price: product.price }],
  });
}

export function trackAddToCart(product: TrackedProduct, quantity: number): void {
  fbq("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price * quantity,
    currency: "TRY",
  });
  gtag("add_to_cart", {
    currency: "TRY",
    value: product.price * quantity,
    items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity }],
  });
}

export function trackInitiateCheckout(items: { id: string; name: string; price: number; quantity: number }[], value: number): void {
  fbq("InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    value,
    currency: "TRY",
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
  });
  gtag("begin_checkout", {
    currency: "TRY",
    value,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
}

export function trackPurchase(order: Order): void {
  fbq("Purchase", {
    content_ids: order.items.map((i) => i.productSlug).filter(Boolean),
    value: order.total,
    currency: "TRY",
    num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
  });
  gtag("purchase", {
    transaction_id: order.orderNumber,
    currency: "TRY",
    value: order.total,
    shipping: order.shipping,
    items: order.items.map((i) => ({
      item_id: i.productSlug,
      item_name: i.name,
      price: i.unitPrice,
      quantity: i.quantity,
    })),
  });
}
