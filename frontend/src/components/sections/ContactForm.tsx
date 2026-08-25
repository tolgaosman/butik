"use client";

import { type FormEvent } from "react";
import { Input, Textarea } from "@/components/ui/Input";

export function ContactForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const subject = data.get("subject") || "";
    const message = data.get("message") || "";

    let text = `Merhaba, ben ${name}.`;
    if (email) text += `\nE-posta: ${email}`;
    if (subject) text += `\nKonu: ${subject}`;
    text += `\n\nMesajım:\n${message}`;

    const encodedText = encodeURIComponent(text);
    // WhatsApp redirect to 0542 873 91 96
    const whatsappUrl = `https://wa.me/905428739196?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot: hidden from real visitors, filled only by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id="contact-name" name="name" label="Ad Soyad" autoComplete="name" required />
        <Input
          id="contact-email"
          name="email"
          label="E-posta (opsiyonel)"
          type="email"
          autoComplete="email"
        />
        <Input id="contact-subject" name="subject" label="Konu" className="sm:col-span-2" required />
      </div>
      <Textarea
        id="contact-message"
        name="message"
        label="Mesajınız"
        rows={5}
        required
        minLength={10}
        className="focus:border-[#25D366]"
      />
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] px-6 py-3.5 text-sm font-medium tracking-wide uppercase text-white transition-colors duration-300 ease-[var(--ease-organic)] hover:bg-[#128C7E] sm:w-auto sm:px-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="h-5 w-5">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-2.1-3.6 1.5-3.8 5.9-12.4 2.8-5.5 1.4-10.6-.9-16.2-2.3-5.6-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
        WhatsApp&apos;tan Gönder
      </button>
    </form>
  );
}
