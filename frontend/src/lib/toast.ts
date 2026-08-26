import { toast as sonnerToast } from "sonner";

/**
 * Thin re-export so call sites import from "@/lib/toast" instead of "sonner"
 * directly — icons, colors and duration are configured once on <Toaster />
 * (components/ui/Toaster.tsx).
 */
export const toast = sonnerToast;
