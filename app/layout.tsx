import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ContactModalProvider } from "@/components/contact/ContactModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Deric Andrews — Digital Creator",
  description:
    "Full-stack developer and AI creator building cinematic digital experiences, intelligent products and creative technology.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-void text-cream">
        <SmoothScrollProvider>
          <ContactModalProvider>{children}</ContactModalProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
