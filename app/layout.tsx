import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto Hotel Luxor - Dashboard",
  description: "Dashboard de administración para Auto Hotel Luxor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
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
