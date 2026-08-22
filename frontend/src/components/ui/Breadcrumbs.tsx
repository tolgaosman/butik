import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const all: BreadcrumbItem[] = [{ label: "Anasayfa", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
      {all.map((item, i) => {
        const isLast = i === all.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="shrink-0 text-sand" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="py-1 transition-colors duration-200 hover:text-olive">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "break-words text-ink" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
