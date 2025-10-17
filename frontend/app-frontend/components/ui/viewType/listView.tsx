import { 
  Heading, HStack, SimpleGrid,
  Separator, Flex, Stack, Spinner
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import GalleryFolder from "@/components/ui/item/galleryFolder";
import ListItem from "../item/listItem";
import ListFolder from "../item/listFolder";
import { useColorModeValue } from '../color-mode'
import SortBar from "../searchbar/sortBar";
import {Folder, File} from "./interfaces"

export interface ListViewProps {
  folders : Folder[];
  files : File[];
}

export default function ListView(props : ListViewProps){
  const folderComponents = props.folders.map(folder => (
      <ListFolder key={folder.id} foldername={folder.name} date={folder.date_modified}/>
    ))
  
  const fileComponents = props.files.map(file => (
    <ListItem key={file.id} filename={file.name} date={file.date_modified} size={file.size}/>
  ))
  
  const centeredSpinner = (<Flex justify="center" w="100%"><Spinner/></Flex>);
  const darkCenteredSpinner = (<Flex justify="center" w="100%"><Spinner color="black"/></Flex>);

  return (<>
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
        color={useColorModeValue("black", 'white')}
        size={"2xl"}
        >Folders</Heading>
    </ HStack>
    
    <Stack
    bg={useColorModeValue("#9AB3F2", '#335098')}
    pl={8}
    pb={3}>
      {folderComponents.length>0 ? folderComponents : centeredSpinner}
      {/* <ListFolder foldername="sonic.png" date="28 September 2025" size="844kb"/> */}
    </Stack>

    <Separator size={"md"} />

    {/* Files */}
    <Flex
      bg={useColorModeValue("white", '#0D1835')}
      justify="space-between"
      w="100%">

      <HStack
      pl={8}
      pb={3}
      pt={5}
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

      <SortBar />
    </Flex>
    


    <Stack
    pl={8}
    pb={10}
    bg={useColorModeValue("white", '#0D1835')}>
      {fileComponents.length>0 ? fileComponents : darkCenteredSpinner}
      {/* <ListItem filename="sonic.png" date="28 September 2025" size="844kb"/>
      <ListItem filename="sonic.png" date="28 September asd asd as" size="844kb"/>
      <ListItem filename="sonic.png" date="28 September 2025" size="4kb"/>
      <ListItem filename="sonic.png" date="28 September 2025" size="844kb"/> */}
    </Stack>
    </>);
}