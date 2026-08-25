import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide uppercase transition-colors duration-300 ease-[var(--ease-organic)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid: "bg-olive text-white hover:bg-olive-dark",
  outline: "border border-ink text-ink hover:border-olive hover:text-olive",
  ghost: "text-ink hover:text-olive",
  link: "text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-olive hover:text-olive normal-case tracking-normal",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3.5 text-sm sm:px-8",
  lg: "px-8 py-4 text-sm sm:px-10",
};

type Common = { variant?: Variant; size?: Size; className?: string; loading?: boolean };

type Props =
  | (Common & Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string })
  | (Common & Omit<ComponentPropsWithoutRef<"button">, "type"> & {
      href?: undefined;
      type?: "button" | "submit" | "reset";
    });

export function Button({ variant = "solid", size = "md", className, loading = false, ...props }: Props) {
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);

  if (props.href !== undefined) {
    const { href, ...rest } = props;
    return <Link href={href} className={classes} {...rest} />;
  }

  const { type = "button", children, disabled, ...rest } = props;

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
