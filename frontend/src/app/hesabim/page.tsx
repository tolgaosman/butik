"use client";

import { useState, type FormEvent } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth, ApiError } from "@/lib/auth";

type FieldErrors = Record<string, string[]>;

/**
 * 422 doğrulama hatalarını alanlara dağıt; geri kalan her şey için tek bir
 * Türkçe mesaj göster — kullanıcıya ham "Server Error" gösterilmez.
 */
function describeError(err: unknown): { fields: FieldErrors; message: string | null } {
  if (err instanceof ApiError) {
    if (err.errors) return { fields: err.errors, message: null };
    if (err.status === 419)
      return { fields: {}, message: "Oturumunuz zaman aşımına uğradı. Sayfayı yenileyip tekrar deneyin." };
    if (err.status >= 500)
      return { fields: {}, message: "Şu anda işleminizi tamamlayamıyoruz. Lütfen birazdan tekrar deneyin." };
    return { fields: {}, message: err.message };
  }
  return { fields: {}, message: "Bir şeyler ters gitti. Lütfen tekrar deneyin." };
}

function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError(null);

    const form = new FormData(e.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
    } catch (err) {
      const { fields, message } = describeError(err);
      setErrors(fields);
      setFormError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-border p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-medium text-ink">Giriş Yap</h2>
      <p className="mt-1 text-sm text-ink-soft">Zaten hesabınız var mı? Giriş yapın.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input
          id="login-email"
          name="email"
          label="E-posta"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.[0]}
        />
        <Input
          id="login-password"
          name="password"
          label="Şifre"
          type="password"
          autoComplete="current-password"
          required
          error={errors.password?.[0]}
        />
        {formError && <p className="text-xs text-red-500">{formError}</p>}
        <Button type="submit" variant="solid" className="w-full" loading={loading}>
          Giriş Yap
        </Button>
      </form>
    </div>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setFormError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const passwordConfirmation = String(form.get("password_confirmation"));

    try {
      await register(String(form.get("name")), String(form.get("email")), password, passwordConfirmation);
    } catch (err) {
      const { fields, message } = describeError(err);
      setErrors(fields);
      setFormError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-border p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-medium text-ink">Hesap Oluştur</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Yeni koleksiyonlardan ve size özel fırsatlardan ilk siz haberdar olun.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input id="signup-name" name="name" label="Ad Soyad" autoComplete="name" required error={errors.name?.[0]} />
        <Input
          id="signup-email"
          name="email"
          label="E-posta"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.[0]}
        />
        <Input
          id="signup-password"
          name="password"
          label="Şifre"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          error={errors.password?.[0]}
        />
        <Input
          id="signup-password-confirmation"
          name="password_confirmation"
          label="Şifre (Tekrar)"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
        {formError && <p className="text-xs text-red-500">{formError}</p>}
        <Button type="submit" variant="outline" className="w-full" loading={loading}>
          Hesap Oluştur
        </Button>
      </form>
    </div>
  );
}

function AccountDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  return (
    <div className="border border-border p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-medium text-ink">Merhaba, {user.name}</h2>
      <p className="mt-1 text-sm text-ink-soft">{user.email}</p>
      <Button
        variant="outline"
        className="mt-6"
        loading={loading}
        onClick={async () => {
          setLoading(true);
          await logout().finally(() => setLoading(false));
        }}
      >
        Çıkış Yap
      </Button>
    </div>
  );
}

export default function AccountPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs items={[{ label: "Hesabım" }]} />
      <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">Hesabım</h1>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 md:gap-10">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="border border-border p-6 sm:p-8">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="mt-2 h-4 w-56" />
              <div className="mt-6 space-y-4">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : user ? (
        <div className="mt-8 sm:mt-10">
          <AccountDashboard />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 md:gap-10">
          <LoginForm />
          <RegisterForm />
        </div>
      )}
    </div>
  );
}
