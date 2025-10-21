import { 
  Heading, HStack, SimpleGrid,
  Separator
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import GalleryItem from "@/components/ui/item/galleryItem";
import GalleryFolder from "@/components/ui/item/galleryFolder";
import { useColorModeValue } from '../color-mode'

export default function GalleryView(){
    return (<>
    {/* Gallery view */}
      {/* Folders */}
      <HStack
      bg={useColorModeValue("#9AB3F2", '#335098')}
      pl={8}
      pb={3}>
        <FaFolder 
          color={useColorModeValue("black", 'white')}
          size={25}/>
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          size={"2xl"}
          color={useColorModeValue("black", 'white')}
          >Folders</Heading>
      </ HStack>
      <SimpleGrid w="100%" minChildWidth={80} gap="6" px={8} pb={10} bg={useColorModeValue("#9AB3F2", '#335098')} >
        <GalleryFolder
          foldername="sonic.png"
          date="28 September 2025"/>
      
        <GalleryFolder 
          foldername="sonic.png"
          date="28 September 2025"/>
      
        <GalleryFolder 
          foldername="sonic.png"
          date="28 September 2025"/>
      
        <GalleryFolder 
          foldername="sonic.png"
          date="28 September 2025"/>
      </SimpleGrid>

      <Separator size={"md"} />

      {/* Files */}
      <HStack
      pl={8}
      pb={3}
      pt={5}
      bg={useColorModeValue("white", '#0D1835')}
      >
        <FaFile 
          color={useColorModeValue("black", 'white')}
          size={22}/>
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color={useColorModeValue("black", 'white')}
          size={"2xl"}
          >Files</Heading>
      </ HStack>
      <SimpleGrid w="100%" minChildWidth={80} gap="6" px={8} pb={20} bg={useColorModeValue("white", '#0D1835')}>
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
      </>);
}