import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";
import ServiceWorkerRegister from "@/components/PWA/ServiceWorkerRegister";
import InstallPrompt from "@/components/PWA/InstallPrompt";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto Hotel Luxor - Dashboard",
  description: "Dashboard de administración para Auto Hotel Luxor",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Luxor Dashboard",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  themeColor: "#1f2937",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ServiceWorkerRegister />
        <InstallPrompt />
        <div className="min-h-screen bg-gray-100">
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
