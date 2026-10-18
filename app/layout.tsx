import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { FEED_TYPES } from "@/lib/site";
import { tokensVersion } from "@/lib/theme";

// Inter is the design system's face (pmOS DESIGN-SYSTEM.md §Type). The variable sits on <html> so the
// --font-body token on :root can resolve it.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Stay up to date on the AI news that matters: what the big AI companies ship and what it means for your business. Plus business and AI systems consulting.";

export const metadata: Metadata = {
  metadataBase: new URL("https://persistentmomentum.com"),
  title: {
    default: "Persistent Momentum — AI news for business operators",
    template: "%s",
  },
  description,
  // Full snippets and large image previews everywhere; never nosnippet/noarchive/nocache
  // (playbook P1 #17, fenlon11/pmOS#685).
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  alternates: { types: FEED_TYPES },
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
    images: [{ url: '/logo.png', width: 780, height: 780, alt: 'Persistent Momentum' }],
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
    <html lang="en" data-theme="light" data-design-tokens={tokensVersion} className={inter.variable}>
      <body className="antialiased">
        <JsonLd data={organizationJsonLd()} />
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
