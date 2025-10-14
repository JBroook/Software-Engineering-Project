import type { Metadata } from "next";
import { Roboto, Roboto_Condensed, Reddit_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "@/components/ui/provider"

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

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Login",
  description: "Your digital solution for asset management",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>{children}</>
  );
}
