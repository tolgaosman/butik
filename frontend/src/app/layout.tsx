import type { Metadata, Viewport } from "next";
import { MotionConfig } from "framer-motion";
import { Raleway } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { Toaster } from "@/components/ui/Toaster";
import { MetaPixel } from "@/components/ui/MetaPixel";
import { getStoreSettings } from "@/lib/settings";
import "./globals.css";


const raleway = Raleway({
  subsets: ["latin", "latin-ext"],
  variable: "--font-raleway",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const settings = await getStoreSettings();

  return (
    <html lang="tr" className={raleway.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased lining-nums">
        {pixelId && <MetaPixel pixelId={pixelId} />}
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer settings={settings} />
                <FloatingWhatsApp settings={settings} />
                <Toaster />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </MotionConfig>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
