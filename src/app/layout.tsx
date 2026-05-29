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
  title: {
    default: "Repurposely — Turn One Video Into a Week of Content",
    template: "%s | Repurposely",
  },
  description:
    "Paste your YouTube link, get platform-perfect content for Twitter, TikTok, LinkedIn, newsletters, and blogs in 30 seconds. Built for creators who refuse to waste time.",
  metadataBase: new URL("https://repurposely.co"),
  openGraph: {
    title: "Repurposely — Turn One Video Into a Week of Content",
    description: "Paste your YouTube link, get platform-perfect content for 7 platforms in 30 seconds.",
    url: "https://repurposely.co",
    siteName: "Repurposely",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repurposely — Turn One Video Into a Week of Content",
    description: "Paste your YouTube link, get platform-perfect content for 7 platforms in 30 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
