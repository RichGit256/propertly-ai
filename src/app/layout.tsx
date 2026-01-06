import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Propertly.ai | Premium Real Estate AI Enhancer",
  description: "Magical real estate photo editing with AI. Enhance lighting, declutter, and stage in seconds.",
};

import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/components/ThemeProvider";

// ...

import { ChatWidget } from "@/components/ChatWidget";
import { GlobalSubscriptionListener } from "@/components/GlobalSubscriptionListener";

// ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <Header />
            {children}
            <Footer />
            <ChatWidget />
            <GlobalSubscriptionListener />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
