"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <EmptyState
          icon={AlertTriangle}
          title="Bir şeyler ters gitti"
          description="Sayfa yüklenirken beklenmedik bir hata oluştu. Lütfen tekrar deneyin."
        />
        <div className="flex justify-center">
          <Button type="button" variant="solid" onClick={reset}>
            Tekrar Dene
          </Button>
        </div>
      </div>
    </div>
  );
}
