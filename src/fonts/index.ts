import localFont from "next/font/local";

// Playfair Display — titulares y nombres de caballo. Didone de alto contraste,
// alineada con la portada del PDF de Eduardo Galán (ADR-0003, reemplaza 0002).
// SIL OFL, autohospedada. Es variable: un solo woff2 cubre los pesos 400-600.
export const playfairDisplay = localFont({
  src: [
    {
      path: "./PlayfairDisplay-Variable.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "./PlayfairDisplay-Italic-Variable.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// Satoshi — texto y datos. Fontshare, licencia libre. ADR-0002 / ADR-0003.
export const satoshi = localFont({
  src: [
    {
      path: "./Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-text",
  display: "swap",
});
