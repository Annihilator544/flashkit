import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  weight: ["100","200","300","400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Flashkit | Sign up today for exclusive early access!",
  description: "AI-powered tools for creators to design stunning videos, graphics, and templates. Optimise content and engagement effortlessly. Launching soon!",
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
      </head>
      <body
        className={`${inter.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
