import { 
  Heading, HStack, SimpleGrid,
  Separator, Flex, Stack
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import GalleryFolder from "@/components/ui/item/galleryFolder";
import ListItem from "../item/listItem";
import ListFolder from "../item/listFolder";
import { useColorModeValue } from '../color-mode'

export default function ListView(){
    return (<>
      {/* Folders */}
      <HStack
      bg={useColorModeValue("#9AB3F2", 'gray.700')}
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
      
      <Stack
      bg="#9AB3F2"
      pl={8}
      pb={3}>
        <ListFolder foldername="sonic.png" date="28 September 2025" size="844kb"/>
        <ListFolder foldername="sonic.png" date="28 September 2025" size="844kb"/>
        <ListFolder foldername="sonic.png" date="28 September 2025" size="844kb"/>
        <ListFolder foldername="sonic.png" date="28 September 2025" size="844kb"/>
      </Stack>

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
      


      <Stack
      pl={8}
      mb={10}>
        <ListItem filename="sonic.png" date="28 September 2025" size="844kb"/>
        <ListItem filename="sonic.png" date="28 September asd asd as" size="844kb"/>
        <ListItem filename="sonic.png" date="28 September 2025" size="4kb"/>
        <ListItem filename="sonic.png" date="28 September 2025" size="844kb"/>
      </Stack>
      </>);
}