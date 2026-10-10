import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "What the AI companies actually shipped, what it means for your business, and one thing to try. Plus business and AI systems consulting.";

export const metadata: Metadata = {
  metadataBase: new URL("https://persistentmomentum.com"),
  title: {
    default: "Persistent Momentum — AI news for business operators",
    template: "%s",
  },
  description,
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Persistent Momentum',
    title: 'Persistent Momentum — AI news for business operators',
    description,
    url: 'https://persistentmomentum.com',
    images: [{ url: '/logo.png', width: 762, height: 720, alt: 'Persistent Momentum' }],
  },
  twitter: {
    card: 'summary',
    title: 'Persistent Momentum',
    description,
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${openSans.variable} antialiased`}>
        <Navigation />
        {children}
        {/* HubSpot tracking, PM portal 247620603 (Matt approved 2026-10-08). */}
        <Script
          id="hs-script-loader"
          src="https://js-na2.hs-scripts.com/247620603.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
