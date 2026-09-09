import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AiCrawlerDoctor from "@/components/modules/AiCrawlerDoctor";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CIHANPOL RC CRAWLER LAB | Özel Yapım Kaya Tırmanıcılar & CNC Parçalar",
  description:
    "1/10 ve 1/24 profesyonel kaya tırmanış araçları, CNC ağır pirinç portal akslar, fırçasız motorlar ve ölçekli tırmanıcı şasileri. Özel kulüp davetiyesi korumalı garaj.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#060709] text-[#EDE8DF] font-sans selection:bg-amber-600 selection:text-black">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <AiCrawlerDoctor />
        </CartProvider>
      </body>
    </html>
  );
}
