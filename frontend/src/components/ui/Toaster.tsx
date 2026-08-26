"use client";

import { Toaster as Sonner } from "sonner";
import { CheckCircle2, XCircle, Info, Loader2 } from "lucide-react";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      gap={10}
      offset={20}
      toastOptions={{
        duration: 4000,
        unstyled: true,
        classNames: {
          toast:
            "group flex !left-0 !right-0 !mx-auto !w-max max-w-[90vw] items-center gap-3 border border-border/60 bg-surface/95 backdrop-blur-md px-5 py-3 shadow-xl shadow-ink/[0.08] pointer-events-auto rounded-2xl",
          title: "text-sm font-medium text-ink leading-snug whitespace-nowrap",
          description: "text-xs text-ink-soft leading-relaxed whitespace-nowrap",
          icon: "shrink-0 flex items-center justify-center",
          closeButton:
            "!border-border !bg-surface !text-ink-soft hover:!text-ink transition-colors duration-200",
          success: "!border-olive/25",
          error: "!border-red-300",
        },
      }}
      icons={{
        success: <CheckCircle2 size={18} className="text-olive" strokeWidth={2} />,
        error: <XCircle size={18} className="text-red-500" strokeWidth={2} />,
        info: <Info size={18} className="text-ink-soft" strokeWidth={2} />,
        loading: <Loader2 size={18} className="animate-spin text-ink-soft" strokeWidth={2} />,
      }}
    />
  );
}
