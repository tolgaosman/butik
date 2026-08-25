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
    <section className="container-site py-8 sm:py-10">
      <div className="grid grid-cols-2 divide-y divide-border border border-border bg-surface p-5 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:p-8">
        {badges.map((badge) => (
          <div key={badge.title} className="py-4 first:pt-0 last:pb-0 sm:px-4 sm:py-0 sm:first:pl-0 sm:last:pr-0">
            <TrustBadge {...badge} />
          </div>
        ))}
      </div>
    </section>
  );
}
