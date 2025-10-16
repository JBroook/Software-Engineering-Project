import { 
  Heading, HStack, SimpleGrid,
  Separator
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import GalleryItem from "@/components/ui/item/galleryItem";
import GalleryFolder from "@/components/ui/item/galleryFolder";

export default function GalleryView(){
    return (<>
    {/* Gallery view */}
      {/* Folders */}
      <HStack
      bg="#9AB3F2"
      pl={8}
      pb={3}>
        <FaFolder 
          color="black"
          size={25}/>
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color="black"
          size={"2xl"}
          >Folders</Heading>
      </ HStack>
      <SimpleGrid w="100%" minChildWidth={80} gap="6" px={8} pb={10} bg="#9AB3F2" >
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
      >
        <FaFile 
          color="black"
          size={22}/>
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color="black"
          size={"2xl"}
          >Files</Heading>
      </ HStack>
      <SimpleGrid w="100%" minChildWidth={80} gap="6" px={8} pb={20}>
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