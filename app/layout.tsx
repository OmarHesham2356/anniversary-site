import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";

import { Nunito_Sans, Playfair_Display } from "next/font/google";

import { anniversaryData } from "@/lib/anniversary-data";

import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: anniversaryData.metadata?.title ?? "Our Anniversary",
  description:
    anniversaryData.metadata?.description ??
    "A private, interactive celebration of our story. Made with love.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf6f1",
};

/**
 * Optional design-system overrides from `anniversaryData.theme`. Values
 * from the config win over the CSS defaults; leave a field out to keep
 * the default look.
 */
function themeStyle(): CSSProperties {
  const theme = anniversaryData.theme ?? {};
  const style: CSSProperties & Record<string, string> = {};
  if (theme.accentColor) style["--accent"] = theme.accentColor;
  if (theme.accentSoftColor) style["--accent-soft"] = theme.accentSoftColor;
  return style;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={themeStyle()}
      className={`${playfair.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-background"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}