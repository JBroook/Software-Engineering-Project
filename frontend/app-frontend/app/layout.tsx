import type { Metadata } from "next";
import { Roboto, Reddit_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider"

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "DAM-N",
  description: "Your digital solution for asset management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-touch" suppressHydrationWarning>
      <body className={`${redditMono.variable} ${roboto.variable} ${robotoCondensed.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
