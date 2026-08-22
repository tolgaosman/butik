import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Blog | Sevgi Butik",
  description: "Sevgi Butik'ten stil önerileri ve moda notları.",
};

const posts = [
  {
    title: "Bu Sezonun Renk Trendleri",
    excerpt: "İlkbahar-yaz sezonuna damgasını vuran tonları ve bu renkleri kombinlerinize nasıl taşıyabileceğinizi derledik.",
    date: "12 Mart 2026",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Kapsül Gardırop Nasıl Oluşturulur?",
    excerpt: "Az parçayla çok kombin yaratmanın sırrı kapsül gardıropta. Temel parçaları seçerken nelere dikkat etmelisiniz?",
    date: "28 Şubat 2026",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Aksesuarla Kombin Tamamlama Rehberi",
    excerpt: "Doğru aksesuar seçimi bir kombini baştan yaratabilir. Kolye, çanta ve gözlük seçerken izleyebileceğiniz basit kurallar.",
    date: "14 Şubat 2026",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "KKTC'de Moda: Yerel Stil Notları",
    excerpt: "Kıbrıs'ın iklimine ve yaşam tarzına uygun, hem şık hem rahat kombinler için ilham verici öneriler.",
    date: "30 Ocak 2026",
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=800&auto=format&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">Blog</h1>
      <p className="mt-3 max-w-lg text-sm text-ink-soft">
        Stil önerileri, moda notları ve Sevgi Butik&apos;ten haberler.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-2">
        {posts.map((post) => (
          <article key={post.title} className="group">
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-sand">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-xs tracking-wide text-ink-soft">{post.date}</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
