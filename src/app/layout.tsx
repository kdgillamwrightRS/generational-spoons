import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
