import type { LucideIcon } from "lucide-react";

export function TrustBadge({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3.5 rounded-2xl bg-cream p-5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-olive">
        <Icon className="size-4" strokeWidth={2} aria-hidden />
      </span>
      <div>
        <p className="font-serif text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}
