'use client'
import SimpleSidebar from "@/components/ui/sidebars/Sidebar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, 
  Heading,
  Image,
  Input, 
  Stack,
  Button,
  HStack
} from "@chakra-ui/react"

export default function Main() {

  return (
    <Box bgGradient="to-b" gradientFrom={useColorModeValue('blue.300', 'blue.800')} 
    gradientTo={useColorModeValue('blue.100', 'blue.950')} minH="100vh">
      {/* Header box for title, search bar and others */}
      <HStack 
      w="100%"
      ml={8}
      h="12vh">
        <HStack>
          <Image width={5} src="/folder_icon.png" alt="folder icon" />
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          fontStyle="italic"
          color="black"
          size={"2xl"}
          >Your Files</Heading>
        </HStack>
      </HStack>
  </Box>
  );
}
