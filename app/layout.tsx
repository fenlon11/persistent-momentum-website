import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Persistent Momentum is a portfolio operator. We design, build, and ship mobile apps, web platforms, and AI-powered automation. pmOS is the build system that makes it work.";

export const metadata: Metadata = {
  metadataBase: new URL("https://persistentmomentum.com"),
  title: {
    default: "Persistent Momentum — Portfolio operator",
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
    title: 'Persistent Momentum — Portfolio operator',
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased blueprint-grid`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
