import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Policy Gap Checker",
  description: "Check a security policy against NIST CSF 2.0 and see what it covers, what is vague, and what is missing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
