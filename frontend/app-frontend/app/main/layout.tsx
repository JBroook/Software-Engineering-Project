import type { Metadata } from "next";
import { Roboto, Roboto_Condensed, Reddit_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "@/components/ui/provider"
import SimpleSidebar from "@/components/ui/sidebars/Sidebar";
import {Flex, Box} from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
      <SimpleSidebar />
      <Box w="85vw" ml="15vw">{children}</Box>
  </>);
}
