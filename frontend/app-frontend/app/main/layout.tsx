import type { Metadata } from "next";
import { Roboto, Roboto_Condensed, Reddit_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "@/components/ui/provider"
import SimpleSidebar from "@/components/ui/sidebars/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
  <SimpleSidebar />
  <main>{children}</main>
  </>);
}
