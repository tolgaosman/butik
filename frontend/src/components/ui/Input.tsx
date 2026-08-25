import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const fieldClasses = (error?: string, className?: string) =>
  cn(
    "w-full border bg-surface px-4 py-2.5 text-sm text-ink transition-colors duration-200 focus-visible:outline-none",
    error ? "border-red-400 focus:border-red-500" : "border-border focus:border-olive",
    className,
  );

type InputProps = ComponentPropsWithoutRef<"input"> & { label: string; error?: string };

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <input id={id} className={fieldClasses(error, className)} aria-invalid={!!error} {...props} />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & { label: string; error?: string };

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <textarea id={id} className={fieldClasses(error, cn("resize-y", className))} aria-invalid={!!error} {...props} />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

type SelectProps = ComponentPropsWithoutRef<"select"> & { label: string; error?: string };

export function Select({ label, error, id, className, children, ...props }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <select id={id} className={fieldClasses(error, className)} aria-invalid={!!error} {...props}>
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
