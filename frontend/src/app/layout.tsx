import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import "./globals.css";


const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sevgi Butik | Düzova, Lefkoşa",
  description:
    "Sevgi Butik — Düzova'dan tüm Kıbrıs'a özenle seçilmiş elbise, giyim ve aksesuar koleksiyonları.",
  openGraph: {
    title: "Sevgi Butik",
    description: "Düzova'dan tüm Kıbrıs'a özenle seçilmiş kadın giyim koleksiyonları.",
    locale: "tr_TR",
  },
  icons: {
    icon: "/sevgiBrowserLogo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${montserrat.variable} font-sans subpixel-antialiased`}>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Header />
                <main>{children}</main>
                <Footer />
                <FloatingWhatsApp />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
