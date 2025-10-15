'use client'
import GalleryItem from "@/components/ui/item/galleryItem";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, 
  Heading,
  Image,
  Grid,
  GridItem,
  HStack,
  Flex,
  SimpleGrid
} from "@chakra-ui/react"

export default function Main() {

  return (
    <Box bgGradient="to-b" gradientFrom={useColorModeValue('blue.300', 'blue.800')} 
    gradientTo={useColorModeValue('blue.100', 'blue.950')} minH="100vh">
      {/* Header box for title, search bar and others */}
      <Flex 
      w="100%"
      h="12vh"
      justify="space-between"
      >
        <HStack
        ml={8}>
          <Image width={5} src="/folder_icon.png" alt="folder icon" />
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          fontStyle="italic"
          color="black"
          size={"2xl"}
          >Your Files</Heading>
        </HStack>
      </Flex>

      {/* Gallery view */}
      <SimpleGrid w="100%" minChildWidth={80} gap="6" px={8}>
        <GalleryItem 
          filename="sonic.png"
          date="28 September 2025"/>
      
        <GalleryItem 
          filename="sonic.png"
          date="28 September 2025"/>
      
        <GalleryItem 
          filename="sonic.png"
          date="28 September 2025"/>
      
        <GalleryItem 
          filename="sonic.png"
          date="28 September 2025"/>
      </SimpleGrid>

  </Box>
  );
}

