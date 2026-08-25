import Link from "next/link";

type Props = {
  eyelash: string;
  title: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyelash, title, href, linkLabel, align = "left" }: Props) {
  if (align === "center") {
    return (
      <div className="mb-8 text-center sm:mb-10">
        <p className="flex items-center justify-center gap-3 text-xs font-medium tracking-[0.25em] text-olive">
          <span className="h-px w-6 bg-olive/50" aria-hidden />
          {eyelash}
          <span className="h-px w-6 bg-olive/50" aria-hidden />
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">{title}</h2>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-end justify-between sm:mb-8">
      <div>
        <p className="flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-olive">
          <span className="h-px w-6 bg-olive/50" aria-hidden />
          {eyelash}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-5xl">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="hidden text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-olive sm:block"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
