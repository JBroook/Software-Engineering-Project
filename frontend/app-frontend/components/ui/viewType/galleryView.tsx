import { 
  Heading, HStack, SimpleGrid,
  Separator, Spinner, Flex,
  Spacer,
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import GalleryItem from "@/components/ui/item/galleryItem";
import GalleryFolder from "@/components/ui/item/galleryFolder";
import { useColorModeValue } from '../color-mode'
import {ViewProps} from './interfaces'
import ContentLoader from "./contentLoader";
import SortBar from "../searchbar/sortBar";


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
    <GalleryItem key={file.id} id={file.original_file} filename={file.name} filetype={file.filetype} image={file.data} date={file.date_created} created_by={file.employee} submitEvent={props.submitEvent}/>
  ))

  return (<>
    {/* Gallery view */}
    {/* Folders */}
    <HStack
    bg={useColorModeValue("#9AB3F2", '#335098')}
    pl={8}
    pb={3}
    justify="space-between">
      <HStack>
        <FaFolder 
          color={useColorModeValue("black", 'white')}
          size={25}/>
        <Heading
        fontFamily="var(--font-roboto-condensed)"
        size={"2xl"}
        color={useColorModeValue("black", 'white')}
        >Folders</Heading>
      </HStack>

      <SortBar onChange={props.sortFolderEvent} sortOptions={[
        { label : "Filename", value : "name"},
        { label : "Last modified", value : "date_modified"}]}/>
    </ HStack>
    
    {folderComponents.length>=3 ?
      <SimpleGrid 
      w="100%" 
      minChildWidth={80} 
      gap="6px" 
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
      :
      <Flex 
      w="100%" 
      gap="6px" 
      px={8} 
      pb={10} 
      bg={useColorModeValue("#9AB3F2", '#335098')} 
      >
        <ContentLoader 
          loading={props.loading}
          color="white"
          content={folderComponents}
        />
      </Flex>
    }

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

      <SortBar onChange={props.sortFileEvent} sortOptions={[
        { label : "Filename", value : "name"},
        { label : "Size", value : "size"},
        { label : "Last modified", value : "date_created"}]}/>
    </Flex>

    {fileComponents.length>=3 ?
      <SimpleGrid 
      w="100%" 
      h='auto'
      minChildWidth={80} 
      gap="6" 
      px={8} 
      pb={20} 
      bg={useColorModeValue("white", '#0D1835')}
      >
        <ContentLoader 
          loading={props.loading}
          color="black"
          content={fileComponents}
        />
        <Spacer></Spacer>
      </SimpleGrid>
    :
      <Flex 
      w="100%" 
      h='auto'
      gap="6" 
      px={8} 
      pb={20} 
      bg={useColorModeValue("white", '#0D1835')}
      >
        <ContentLoader 
          loading={props.loading}
          color="black"
          content={fileComponents}
        />
      </Flex>
    }
    </>);
}