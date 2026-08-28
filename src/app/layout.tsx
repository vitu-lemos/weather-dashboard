import type { Metadata } from "next";
import { Suspense } from "react";

import { AppShell } from "@/components/AppShell/AppShell";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { AppHeaderSkeleton } from "@/components/AppHeader/AppHeaderSkeleton";
import { Disclaimer } from "@/components/Disclaimer/Disclaimer";

import { Inter } from "next/font/google";
import "./globals.css";
import "../../public/css/weather-icons.min.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weather Service",
  description: "Vitor Lemos - dev pro test",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        <AppShell>
          <Suspense fallback={<AppHeaderSkeleton />}>
            <AppHeader />
          </Suspense>
          <main>{children}</main>
          <footer>
            <Disclaimer />
          </footer>
        </AppShell>
      </body>
    </html>
  );
}
