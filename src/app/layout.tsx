import type { Metadata } from "next";

import { AppShell } from "@/components/AppShell/AppShell";
import { AppHeader } from "@/components/AppHeader/AppHeader";

import { Inter } from "next/font/google";
import "./globals.css";

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
          <AppHeader />
          {children}
        </AppShell>
      </body>
    </html>
  );
}
