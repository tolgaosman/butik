import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-soft">
      <Link href="/" className="flex items-center transition-colors duration-200 hover:text-olive">
        <Home size={13} aria-hidden />
        <span className="sr-only">Ana Sayfa</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex min-w-0 items-center gap-1.5">
          <ChevronRight size={12} className="shrink-0 text-ink-soft/50" aria-hidden />
          {item.href ? (
            <Link href={item.href} className="truncate transition-colors duration-200 hover:text-olive">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="truncate text-ink">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
