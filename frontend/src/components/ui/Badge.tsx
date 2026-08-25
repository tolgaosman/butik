import { cn } from "@/lib/cn";

type Variant = "new" | "sale" | "neutral";

const variants: Record<Variant, string> = {
  new: "bg-sand text-ink",
  sale: "bg-olive text-white",
  neutral: "bg-surface/90 text-ink backdrop-blur-sm",
};

export function Badge({ variant = "neutral", className, children }: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.05em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
