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
  title: "MapleStory HP/MP Washing Calculator",
  description:
    "Calculate optimal HP washing strategies for MapleStory private servers. Visualize HP and MP growth by class, minimize AP reset costs, and plan washing goals based on boss requirements.",
  authors: [{ name: "Otter" }],
  keywords: [
    "MapleStory",
    "washing",
    "HP washing",
    "MP washing",
    "calculator",
    "optimization",
    "private server",
    "character planning",
    "AP reset",
    "HP calculator",
    "MP calculator",
  ],
  openGraph: {
    title: "MapleStory HP/MP Washing Calculator",
    description:
      "Calculate optimal HP washing strategies for MapleStory private servers. Visualize HP and MP growth by class and minimize AP reset costs.",
    type: "website",
    images: [
      {
        url: "https://washing.otterstory.club/opengraph-cover.png?v=2",
        width: 1200,
        height: 630,
        alt: "MapleStory HP/MP Washing Calculator - Optimize your washing strategy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MapleStory HP/MP Washing Calculator",
    description:
      "Calculate optimal HP washing strategies for MapleStory private servers. Visualize HP and MP growth by class and minimize AP reset costs.",
    images: ["https://washing.otterstory.club/opengraph-cover.png?v=2"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
