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
  title: "Eventtee",
  description:
    "Eventtee is a full-stack event discovery and booking platform where users can discover, explore, and book events, while organizers can create, publish, and manage their events. The platform provides secure authentication, event categorization, seat-based booking, booking management, and event reviews, with a scalable REST API powering the client application.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
