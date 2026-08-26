"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg transform rounded border border-border bg-surface p-4 shadow-xl transition-all sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="modal-title" className="font-serif text-xl font-medium text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-ink-soft hover:bg-cream hover:text-ink transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="max-h-[75vh] overflow-y-auto pr-1 -mr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
