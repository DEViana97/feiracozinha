import type { Metadata, Viewport } from "next";
import { Faculty_Glyphic } from "next/font/google";
import { SiteAnalytics } from "@/components/site-analytics";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Fonte única do site (títulos e texto corrido). Só existe o peso 400: negrito
// e itálico são sintetizados pelo navegador.
const glyphic = Faculty_Glyphic({
  variable: "--font-glyphic",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Feira, Cozinha e Mesa",
  description:
    "Cozinha contemporânea de território no Ceará. Da nossa terra para o centro da sua mesa.",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${glyphic.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-center" />
        <SiteAnalytics />
      </body>
    </html>
  );
}
