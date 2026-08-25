import { redirect } from "next/navigation";

/** Panelin girişi sipariş listesi — ayrı bir gösterge paneli yok. */
export default function AdminPage() {
  redirect("/admin/siparisler");
}
