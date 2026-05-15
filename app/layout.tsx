import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Persistent Momentum builds products. Persistent Recruiter is live. Persistent Sales is coming. Each product stands alone.";

export const metadata: Metadata = {
  metadataBase: new URL("https://persistentmomentum.com"),
  title: {
    default: "Persistent Momentum — We build products",
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
    title: 'Persistent Momentum — We build products',
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
      </body>
    </html>
  );
}
