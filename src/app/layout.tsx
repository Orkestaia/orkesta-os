
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orkesta OS",
  description: "Unified Operating System for Orkesta Automation & AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:pl-64 transition-all duration-200 ease-in-out">
            <div className="container mx-auto p-6 md:p-8 lg:p-10 max-w-7xl">
              {children}
            </div>
          </main>
          <AIChatWidget />
        </div>
      </body>
    </html>
  );
}
