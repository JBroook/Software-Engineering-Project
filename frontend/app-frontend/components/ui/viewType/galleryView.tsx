import { 
  Heading, HStack, SimpleGrid,
  Separator, Spinner, Flex,
  Spacer,
  Button,
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { AiFillFolderAdd } from "react-icons/ai";
import GalleryItem from "@/components/ui/item/galleryItem";
import GalleryFolder from "@/components/ui/item/galleryFolder";
import { useColorModeValue } from '../color-mode'
import {ViewProps} from './interfaces'
import ContentLoader from "./contentLoader";
import SortBar from "../searchbar/sortBar";
import FolderCreate from "../folder/folderCreate";

export default function GalleryView(props : ViewProps){
  const textColor = useColorModeValue('black', '#DAE1F6');
  const filebg = useColorModeValue('white', '#2A385B');
  const folderbg = useColorModeValue("#9AB3F2", '#1D263F');

  const folderComponents = props.folders.map(folder => (
    <GalleryFolder 
      isAllowedEdit={props.isAllowedEdit}
      id={folder.id}
      key={folder.id} 
      foldername={folder.name}
      date={folder.date_modified}
      clickEvent={props.clickEvent}
    />
  ))

  const fileComponents = props.files.map(file => (
    <GalleryItem 
    isAllowedEdit={props.isAllowedEdit}
    key={file.id} 
    id={file.original_file} 
    parent_folder={file.parent_folder} 
    filename={file.name} 
    filetype={file.filetype} 
    media={file.media_type}
    tags={file.tags}
    image={file.data} 
    date={file.date_created} 
    created_by={file.employee} 
    submitEvent={props.submitEvent}/>
  ))

  return (<>
    {/* Gallery view */}
    {/* Folders */}
    <HStack
    bg={folderbg}
    pl={8}
    pb={3}
    justify="space-between">
      <HStack>
        <FaFolder 
          color={textColor}
          size={25}/>
        <Heading
        fontFamily="var(--font-roboto-condensed)"
        size={"2xl"}
        color={textColor}
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
      gap="10px" 
      px={8} 
      pb={10} 
      bg={folderbg} 
      >
        {props.isAllowedEdit == true ? (
          <FolderCreate id={props.folderId} name={props.folderName} clickEvent={props.clickEvent} />
        ):(
          <></>
        )}
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
      bg={folderbg} 
      >
        <FolderCreate id={props.folderId} name={props.folderName} clickEvent={props.clickEvent} />
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
      bg={filebg}
      justify="space-between"
      w="100%">

      <HStack
      pl={8}
      pb={3}
      pt={5}
      >
        <FaFile 
          color={textColor}
          size={22}/>
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color={textColor}
          size={"2xl"}
          >Files</Heading>
      </ HStack>

      <SortBar onChange={props.sortFileEvent} sortOptions={[
        { label : "Filename", value : "name"},
        { label : "Size", value : "size"},
        { label : "Last modified", value : "date_created"}]}/>
    </Flex>

    {fileComponents.length>=4 ?
      <SimpleGrid 
      w="100%" 
      h='auto'
      minChildWidth={270} 
      column={4}
      gap="6" 
      px={8} 
      pb={20} 
      bg={filebg}
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
      bg={filebg}
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