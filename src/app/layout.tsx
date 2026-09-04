import type { Metadata } from "next";
import { BarraNavegacion } from "@/components/BarraNavegacion";
import { playfairDisplay, satoshi } from "@/fonts";
import "./globals.css";

const SITE_NAME = "Santa María Performance Horses";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_NAME,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${playfairDisplay.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BarraNavegacion />
        {children}
      </body>
    </html>
  );
}
