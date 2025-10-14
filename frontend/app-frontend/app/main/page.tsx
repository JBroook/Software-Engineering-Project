'use client'
import { Box } from "@chakra-ui/react";
import SimpleSidebar from "@/components/ui/sidebars/Sidebar";
import { useColorModeValue } from "@/components/ui/color-mode";
// import { usePathname } from 'next/navigation';

export default function Home() {
  // const pathname = usePathname();
  // const noSidebarPages = ['/login'];
  // const renderSidebar = !noSidebarPages.includes(pathname);

  return (
    <>
    {/* <Box 
    w={"100vw"}
    h={"100vh"}
    bgGradient="to-b" gradientFrom={useColorModeValue('blue.300', 'blue.800')} gradientTo={useColorModeValue('blue.100', 'blue.950')}>
      {renderSidebar && <SimpleSidebar  />}
    </Box> */}
  </>
  );
}
