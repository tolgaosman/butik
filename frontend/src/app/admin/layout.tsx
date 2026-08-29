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
    <div className="flex h-screen overflow-hidden bg-cream">
      {/*
        Yetki perdesi. children her zaman render edilir — bir layout children'ı
        koşullu render ederse sunucu o alt ağacı hiç çözmez ve hydration sonrası
        elinde payload kalmaz. Gizlemek yeterli: asıl kapı backend'de
        (/api/admin/* → auth:sanctum + admin), yetkisiz istek zaten 403 alır.
      */}
      {!isAuthorized && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-cream">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-olive" />
            <p className="text-sm text-ink-soft">
              {isLoading ? "Oturum doğrulanıyor…" : "Giriş sayfasına yönlendiriliyorsunuz…"}
            </p>
          </div>
        </div>
      )}
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-surface transition-transform duration-300 ease-[var(--ease-organic)] lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-16 items-center justify-center border-b border-border px-6">
          <Link href="/admin/siparisler" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/sevgiLogo-ink.png"
              alt="Sevgi Butik Admin"
              width={160}
              height={60}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button 
            className="absolute right-6 text-ink-soft hover:text-ink lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-olive/10 text-olive"
                      : "text-ink-soft hover:bg-cream hover:text-ink"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-olive" : "text-ink-soft group-hover:text-ink"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border pt-4">
            <button
              onClick={async () => {
                await logout();
                router.replace("/admin_login");
              }}
              className="group flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} className="text-ink-soft group-hover:text-red-600" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2 p-2 text-ink-soft transition-colors duration-200 hover:text-ink lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink">
                {user?.name || "Yönetici"}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-sm font-medium text-white">
                {user?.name?.charAt(0) || "Y"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
