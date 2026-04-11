import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Accurate Pathalogy Laboratory | Book Lab Tests Online",
  description: "Book health checkups & blood tests online with free home sample collection. NABL certified labs, doctor-verified reports in 14 hours. Trusted by 5M+ users across 200+ cities.",
  keywords: "lab tests online, blood test at home, health checkup, diagnostic centre, full body checkup, thyroid test, CBC test",
  openGraph: {
    title: "Accurate Pathalogy Laboratory",
    description: "Book health checkups & blood tests with free home sample collection. NABL certified, 99.8% accuracy.",
    type: "website",
    locale: "en_IN",
    siteName: "Accurate Pathalogy Laboratory",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased overflow-x-hidden w-full max-w-[100vw]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
