import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "CityCare — City Complaint & Municipal Service Platform",
    template: "%s | CityCare Portal",
  },
  description:
    "Empowering citizens to report, track, and resolve municipal complaints and public service requests with transparent, SLA-backed governance and bKash payment verification.",
  keywords: [
    "CityCare",
    "city complaint portal",
    "municipal services",
    "civic grievance redressal",
    "road repair",
    "waste management",
    "WASA water supply",
    "street lighting",
    "bKash municipal payment",
    "Dhaka civic governance",
  ],
  authors: [{ name: "CityCare Municipal Engineering Team" }],
  creator: "CityCare Municipal Authority",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CityCare Municipal Portal",
    title: "CityCare — City Complaint & Municipal Service Platform",
    description:
      "Lodge complaints, monitor real-time field technician resolution, and pay municipal inspection fees securely via bKash.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CityCare — City Complaint & Municipal Service Platform",
    description:
      "Transparent civic service request system with SLA guarantees and multi-role operations.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    title: "CityCare",
  },
  other: {
    "apple-mobile-web-app-title": "CityCare",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        ibmPlexSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
