import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"input"> & { label: string; error?: string };

export function Input({ label, error, id, className = "", ...props }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        className={`w-full border px-4 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-none ${
          error ? "border-red-400 focus:border-red-500" : "border-sand focus:border-olive"
        } ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
