import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { PromoModal } from "@/components/cro/promo-modal";
import { CookieConsent } from "@/components/cro/cookie-consent";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Analytics } from "@/components/analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kraftybrix.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KraftyBrix — Build The Garage You've Always Dreamed Of",
    template: "%s · KraftyBrix",
  },
  description:
    "Premium brick-built automotive collectibles for enthusiasts who never stop dreaming. Collector-grade supercars, hypercars and JDM legends.",
  keywords: ["brick car", "model car kit", "supercar model", "collectible cars", "KraftyBrix"],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "KraftyBrix — Build The Garage You've Always Dreamed Of",
    description:
      "Premium brick-built automotive collectibles for enthusiasts who never stop dreaming.",
    siteName: "KraftyBrix",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "KraftyBrix" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KraftyBrix",
    description: "Premium brick-built automotive collectibles.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KraftyBrix",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://instagram.com/kraftybrix",
      "https://youtube.com/@kraftybrix",
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${display.variable} dark`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ScrollProgress />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <PromoModal />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
