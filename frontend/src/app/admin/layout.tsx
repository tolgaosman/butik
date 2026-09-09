"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Star
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navigation = [
  { name: "Ana Sayfa", href: "/admin/ana-sayfa", icon: Home },
  { name: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
  { name: "Ürünler", href: "/admin/urunler", icon: Package },
  { name: "Kategoriler", href: "/admin/kategoriler", icon: Layers },
  { name: "Müşteriler", href: "/admin/musteriler", icon: Users },
  { name: "Değerlendirmeler", href: "/admin/degerlendirmeler", icon: Star },
  { name: "Ayarlar", href: "/admin/ayarlar", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthorized = !!user?.isAdmin;

  useEffect(() => {
    if (!isLoading && !isAuthorized) router.replace("/admin_login");
  }, [isLoading, isAuthorized, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-cream font-sans">
      {/*
        Yetki perdesi. children her zaman render edilir — bir layout children'ı
        koşullu render ederse sunucu o alt ağacı hiç çözmez ve hydration sonrası
        elinde payload kalmaz. Gizlemek yeterli: asıl kapı backend'de
        (/api/admin/* → auth:sanctum + admin), yetkisiz istek zaten 403 alır.
      */}
      {!isAuthorized && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-cream/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-surface p-8 shadow-xl">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-olive" />
            <p className="text-sm font-medium text-ink-soft">
              {isLoading ? "Oturum doğrulanıyor…" : "Giriş sayfasına yönlendiriliyorsunuz…"}
            </p>
          </div>
        </div>
      )}
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border/60 bg-surface shadow-2xl transition-transform duration-500 ease-[var(--ease-organic)] lg:static lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-20 items-center justify-center px-6 pt-2">
          <Link href="/admin/siparisler" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/sevgiLogo-ink.png"
              alt="Sevgi Butik Admin"
              width={160}
              height={60}
              className="h-9 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>
          <button 
            className="absolute right-4 text-ink-soft hover:bg-ink/5 p-2 rounded-full transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100vh-5rem)] flex-col justify-between overflow-y-auto px-4 py-8 scrollbar-hide">
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-olive text-white shadow-md shadow-olive/20 scale-[0.98]"
                      : "text-ink-soft hover:bg-cream hover:text-ink hover:scale-[0.98]"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-white" : "text-ink-soft group-hover:text-ink"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border/60 pt-6 pb-4">
            <button
              onClick={async () => {
                await logout();
                router.replace("/admin_login");
              }}
              className="group flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-soft transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:scale-[0.98]"
            >
              <LogOut size={18} className="text-ink-soft group-hover:text-red-600 transition-colors" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-border/60 bg-surface/80 backdrop-blur-xl px-4 sm:px-8">
          <button
            type="button"
            className="-ml-2 rounded-full p-2.5 text-ink-soft transition-colors duration-200 hover:bg-ink/5 hover:text-ink lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-1 items-center justify-end gap-5">
            <div className="flex items-center gap-3.5 rounded-full border border-border/60 bg-cream/50 py-1.5 pl-4 pr-1.5 shadow-sm">
              <span className="text-sm font-semibold text-ink">
                {user?.name || "Yönetici"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white shadow-sm">
                {user?.name?.charAt(0) || "Y"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-cream p-4 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
