import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SetupNotice } from "@/components/SetupNotice";
import { getMissingSupabaseEnvVars } from "@/lib/supabase/config";
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
  title: "Farm Field Log",
  description: "A simple digital field journal for farmers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Until Supabase is configured, show setup instructions instead of a broken app.
  const missingEnvVars = getMissingSupabaseEnvVars();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {missingEnvVars.length > 0 ? <SetupNotice missing={missingEnvVars} /> : children}
      </body>
    </html>
  );
}
