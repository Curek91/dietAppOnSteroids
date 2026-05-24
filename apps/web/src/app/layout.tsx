import type { Metadata, Viewport } from "next";
import "./globals.css";
import { copy, DEFAULT_LOCALE } from "@/lib/i18n/copy";

const t = copy[DEFAULT_LOCALE];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dietapp.pl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: t.meta.title,
    template: "%s · DietApp"
  },
  description: t.meta.description,
  applicationName: "DietApp",
  authors: [{ name: "DietApp" }],
  creator: "DietApp",
  publisher: "DietApp",
  keywords: t.meta.keywords,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    alternateLocale: ["en_US"],
    siteName: "DietApp",
    title: t.meta.title,
    description: t.meta.description,
    url: SITE_URL
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.title,
    description: t.meta.description
  },
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/",
      "en-US": "/?lang=en"
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
