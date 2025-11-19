import type { Metadata } from "next";
import { Caveat, Lora } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Generational Spoons",
  description: "Preserving family recipes, one dish at a time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} ${lora.variable} antialiased`} style={{ fontFamily: 'var(--font-lora)' }}>
        <div className="w-[90%] sm:w-4/5 mx-auto">
          <Navigation />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
