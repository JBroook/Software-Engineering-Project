import type { Metadata } from "next";
import { Roboto, Reddit_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-touch" suppressHydrationWarning>
      <body className={`${roboto.variable} ${redditMono.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
