"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { Dropdown, type DropdownOption } from "./Dropdown";

const fieldClasses = (error?: string, className?: string) =>
  cn(
    "w-full border bg-surface px-4 py-2.5 text-sm text-ink transition-colors duration-200 focus-visible:outline-none normal-nums font-sans",
    error ? "border-red-400 focus:border-red-500" : "border-border focus:border-olive",
    className,
  );

export type InputFilter = "name" | "phone" | "numeric" | "email";

function applyFilter(value: string, filter?: InputFilter): string {
  switch (filter) {
    case "name":
      return value.replace(/[^A-Za-zğüşıöçĞÜŞİÖÇ\s.-]/g, "");
    case "phone":
      return value.replace(/[^0-9+\s()-]/g, "");
    case "numeric":
      return value.replace(/[^0-9]/g, "");
    case "email":
      return value.replace(/\s/g, "");
    default:
      return value;
  }
}

type InputProps = ComponentPropsWithoutRef<"input"> & { 
  label: string; 
  error?: string;
  inputFilter?: InputFilter;
};

export function Input({ label, error, id, className, type, inputFilter, onInput, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (inputFilter) {
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const oldVal = e.currentTarget.value;
      const newVal = applyFilter(oldVal, inputFilter);
      
      if (oldVal !== newVal) {
        e.currentTarget.value = newVal;
        if (start !== null && end !== null) {
           const diff = oldVal.length - newVal.length;
           e.currentTarget.setSelectionRange(start - diff, end - diff);
        }
      }
    }
    onInput?.(e);
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <div className="relative">
        <input 
          id={id} 
          type={currentType}
          className={fieldClasses(error, cn(className, isPassword && "pr-10"))} 
          aria-invalid={!!error}
          onInput={handleInput}
          pattern={inputFilter === "email" ? "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$" : props.pattern}
          title={inputFilter === "email" ? "Lütfen geçerli bir e-posta adresi girin (örn: ornek@posta.com)" : props.title}
          {...props} 
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink focus:outline-none"
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
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

type SelectProps = {
  label: string;
  error?: string;
  id?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
};

export function Select({ label, error, id, className, value, onChange, options, placeholder, disabled }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      <Dropdown
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        className={fieldClasses(error, className)}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
