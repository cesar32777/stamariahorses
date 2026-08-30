import type { Metadata } from "next";
import { cabinetGrotesk, satoshi } from "@/fonts";
import "./globals.css";

const SITE_NAME = "Santa Maria Performance Horses";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_NAME,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${cabinetGrotesk.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
