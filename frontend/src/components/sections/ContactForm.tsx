"use client";

import { useState, type FormEvent } from "react";
import { apiMutate, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type FieldErrors = Record<string, string[]>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus("idle");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await apiMutate("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: String(data.get("name")),
          email: String(data.get("email")),
          phone: String(data.get("phone") || "") || undefined,
          subject: String(data.get("subject") || "") || undefined,
          message: String(data.get("message")),
          website: String(data.get("website") || ""),
        }),
      });
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) setErrors(err.errors ?? {});
    } finally {
      setLoading(false);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-olive/30 bg-olive/5 p-6 text-center">
        <p className="font-display text-lg font-medium text-ink">Mesajınız gönderildi</p>
        <p className="mt-1 text-sm text-ink-soft">En kısa sürede size dönüş yapacağız.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot: hidden from real visitors, filled only by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id="contact-name" name="name" label="Ad Soyad" autoComplete="name" required error={errors.name?.[0]} />
        <Input
          id="contact-email"
          name="email"
          label="E-posta"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.[0]}
        />
        <Input id="contact-phone" name="phone" label="Telefon (opsiyonel)" type="tel" autoComplete="tel" />
        <Input id="contact-subject" name="subject" label="Konu (opsiyonel)" />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-ink-soft">
          Mesajınız
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          minLength={10}
          className="w-full border border-sand px-4 py-2.5 text-sm transition-colors duration-200 focus:border-olive focus-visible:outline-none"
        />
        {errors.message?.[0] && <p className="mt-1.5 text-xs text-red-500">{errors.message[0]}</p>}
      </div>
      {status === "error" && Object.keys(errors).length === 0 && (
        <p className="text-xs text-red-500">Mesajınız gönderilemedi. Lütfen tekrar deneyin.</p>
      )}
      <Button type="submit" variant="solid" loading={loading}>
        Gönder
      </Button>
    </form>
  );
}
