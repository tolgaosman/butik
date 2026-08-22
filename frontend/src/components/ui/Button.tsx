import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "solid" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium tracking-wide uppercase transition-all duration-300 ease-[var(--ease-organic)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none sm:px-8";

const variants: Record<Variant, string> = {
  solid:
    "bg-olive text-cream hover:bg-olive-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-olive/20 active:translate-y-0",
  outline:
    "border border-olive text-olive hover:bg-olive hover:text-cream hover:-translate-y-0.5 active:translate-y-0",
};

type Common = { variant?: Variant; className?: string; loading?: boolean };

type Props =
  | (Common & Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string })
  | (Common & Omit<ComponentPropsWithoutRef<"button">, "type"> & {
      href?: undefined;
      type?: "button" | "submit" | "reset";
    });

export function Button({ variant = "solid", className = "", loading = false, ...props }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;

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
