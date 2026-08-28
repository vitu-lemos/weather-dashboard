import type { Metadata } from "next";

import { AppShell } from "@/components/AppShell/AppShell";
import { AppHeader } from "@/components/AppHeader/AppHeader";
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
          <AppHeader />
          <main>{children}</main>
          <footer>
            <Disclaimer />
          </footer>
        </AppShell>
      </body>
    </html>
  );
}
