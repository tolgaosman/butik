import { redirect } from "next/navigation";

/** Eski kısa URL — zengin takip sayfası artık tek adres: /siparis-takibi. */
export default function OrderTrackingRedirect() {
  redirect("/siparis-takibi");
}
