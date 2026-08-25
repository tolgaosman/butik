import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Beden Rehberi | Sevgi Butik",
  description: "Sevgi Butik beden rehberi ve ölçü tablosu.",
};

const sizeChart = [
  { size: "36", bust: "84", waist: "66", hip: "92" },
  { size: "38", bust: "88", waist: "70", hip: "96" },
  { size: "40", bust: "92", waist: "74", hip: "100" },
  { size: "42", bust: "96", waist: "78", hip: "104" },
  { size: "44", bust: "100", waist: "82", hip: "108" },
  { size: "46", bust: "104", waist: "86", hip: "112" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Beden Rehberi" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">Beden Rehberi</h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        Size en uygun bedeni seçebilmeniz için ölçülerinizi santimetre cinsinden alıp aşağıdaki tablo ile
        karşılaştırmanızı öneririz. Göğüs ölçünüzü en geniş noktadan, bel ölçünüzü doğal bel çizginizden ve
        kalça ölçünüzü en geniş noktadan alınız.
      </p>

      <div className="mt-8 overflow-x-auto border border-border">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-cream/60 text-xs font-medium tracking-wide text-ink-soft">
              <th className="px-4 py-3">Beden</th>
              <th className="px-4 py-3">Göğüs (cm)</th>
              <th className="px-4 py-3">Bel (cm)</th>
              <th className="px-4 py-3">Kalça (cm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sizeChart.map((row) => (
              <tr key={row.size}>
                <td className="px-4 py-3 font-medium text-ink">{row.size}</td>
                <td className="px-4 py-3 text-ink-soft">{row.bust}</td>
                <td className="px-4 py-3 text-ink-soft">{row.waist}</td>
                <td className="px-4 py-3 text-ink-soft">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink-soft">
        İki beden arasında kaldıysanız, rahat bir kesim için büyük olan bedeni tercih etmenizi öneririz.
        Ürüne özel kalıp notları varsa ürün sayfasında belirtilmiştir. Beden konusunda tereddüt
        yaşıyorsanız mağazamızı arayarak destek alabilirsiniz.
      </p>
    </div>
  );
}
