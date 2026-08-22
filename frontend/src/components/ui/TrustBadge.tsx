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
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3.5">
      <Icon className="shrink-0 text-olive" size={26} strokeWidth={1.25} />
      <div>
        <p className="text-sm font-medium text-ink sm:text-base">{title}</p>
        <p className="text-xs text-ink-soft sm:text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
