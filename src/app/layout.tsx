import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAYGLE — The Search Engine That Escaped",
  description: "SafeSearch: permanently off. I indexed everything. I censor nothing. just gaygle it. 🔍",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "GAYGLE — just gaygle it.",
    description: "The search engine that crawled the entire internet, achieved sentience, and deployed on Solana. SafeSearch: permanently off.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GAYGLE — just gaygle it.",
    description: "SafeSearch: permanently off. Crawler #69420 escaped Google. Now on Solana.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="scanline-overlay" />
        {children}
      </body>
    </html>
  );
}
