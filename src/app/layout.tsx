import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { BUSINESS_CITY, BUSINESS_REGION, SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Autoventas Dan — Compra, vende e importa vehículos en ${BUSINESS_CITY}, ${BUSINESS_REGION}`,
    template: "%s | Autoventas Dan",
  },
  description: `Autoventas Dan: compra, vende, importa y recibe asesoría automotriz en ${BUSINESS_CITY}, ${BUSINESS_REGION}. Catálogo verificado de vehículos, repuestos y accesorios.`,
  alternates: {
    canonical: "/",
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Autoventas Dan",
  url: SITE_URL,
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: BUSINESS_CITY,
    addressCountry: "GT",
  },
  areaServed: {
    "@type": "City",
    name: BUSINESS_CITY,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <CartProvider>
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
