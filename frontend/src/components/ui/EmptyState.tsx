import type { LucideIcon } from "lucide-react";
import { Button } from "./Button";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
};

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref, onCtaClick }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-14 text-center sm:py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand/50 text-olive">
        <Icon size={26} strokeWidth={1.25} />
      </div>
      <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">{title}</h2>
      <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      {ctaLabel &&
        (onCtaClick ? (
          <Button type="button" onClick={onCtaClick} variant="outline" size="sm" className="mt-2">
            {ctaLabel}
          </Button>
        ) : (
          ctaHref && (
            <Button href={ctaHref} variant="outline" size="sm" className="mt-2">
              {ctaLabel}
            </Button>
          )
        ))}
    </div>
  );
}
