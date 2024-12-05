import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  weight: ["100","200","300","400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Flashkit",
  description: "Free online design editor. Create images for social media, Instagram, youtube previews, facebook covers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/flashkitLogo.svg" />
        <title>Flashkit</title>
      </head>
      <body
        className={`${inter.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
