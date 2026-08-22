import type { LucideIcon } from "lucide-react";
import { Button } from "./Button";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-14 text-center sm:py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand/60 text-olive">
        <Icon size={28} strokeWidth={1.25} />
      </div>
      <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
      <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      {ctaLabel && ctaHref && (
        <Button href={ctaHref} variant="solid" className="mt-2">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
