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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <TrustBadge key={badge.title} {...badge} />
        ))}
      </div>
    </section>
  );
}
