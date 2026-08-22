import { Truck, PackageCheck, ShieldCheck, Tag } from "lucide-react";
import { TrustBadge } from "@/components/ui/TrustBadge";

const badges = [
  { icon: Truck, title: "Ücretsiz Kargo", subtitle: "₺2.500 üzeri siparişlerde" },
  { icon: PackageCheck, title: "30 Gün İade", subtitle: "Sorunsuz iade ve değişim" },
  { icon: ShieldCheck, title: "Güvenli Ödeme", subtitle: "%100 güvenli ödeme altyapısı" },
  { icon: Tag, title: "Size Özel Fırsatlar", subtitle: "Sadık müşterilerimize özel" },
];

export function TrustBar() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-sm bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:grid-cols-4 sm:gap-8 sm:p-8">
        {badges.map((badge, i) => (
          <div key={badge.title} className={i > 0 ? "sm:border-l sm:border-sand sm:pl-4 sm:-ml-4" : ""}>
            <TrustBadge {...badge} />
          </div>
        ))}
      </div>
    </section>
  );
}
