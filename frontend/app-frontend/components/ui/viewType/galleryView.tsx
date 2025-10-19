import { 
  Heading, HStack, SimpleGrid,
  Separator, Spinner, Flex
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import GalleryItem from "@/components/ui/item/galleryItem";
import GalleryFolder from "@/components/ui/item/galleryFolder";
import { useColorModeValue } from '../color-mode'
import {ViewProps} from './interfaces'
import ContentLoader from "./contentLoader";


export default function GalleryView(props : ViewProps){
  const folderComponents = props.folders.map(folder => (
    <GalleryFolder 
      id={folder.id}
      key={folder.id} 
      foldername={folder.name} 
      date={folder.date_modified}
      clickEvent={() => props.clickEvent(folder.id, folder.name)}
    />
  ))

  const fileComponents = props.files.map(file => (
    <GalleryItem key={file.id} filename={file.name} date={file.date_modified}/>
  ))

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
    <SimpleGrid 
    w="100%" 
    minChildWidth={80} 
    gap="6" 
    px={8} 
    pb={10} 
    bg={useColorModeValue("#9AB3F2", '#335098')} 
    >
      <ContentLoader 
        loading={props.loading}
        color="white"
        content={folderComponents}
      />
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
      <ContentLoader 
        loading={props.loading}
        color="black"
        content={fileComponents}
      />
    </SimpleGrid>
    </>);
}