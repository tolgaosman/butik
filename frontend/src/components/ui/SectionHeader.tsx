import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, href, linkLabel, align = "left" }: Props) {
  if (align === "center") {
    return (
      <div className="mb-10 text-center sm:mb-14">
        <p className="text-xs font-medium tracking-[0.3em] text-olive">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">{title}</h2>
      </div>
    );
  }

  return (
    <div className="mb-8 flex items-end justify-between sm:mb-10">
      <div>
        <p className="text-xs font-medium tracking-[0.3em] text-olive">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-olive sm:flex"
        >
          {linkLabel}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 ease-[var(--ease-organic)] group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
