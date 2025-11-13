import { 
  Heading, HStack, 
  Separator, Flex, Stack, Spinner,
  Tooltip, Text,
  Portal
} from "@chakra-ui/react"
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import ListItem from "../item/listItem";
import ListFolder from "../item/listFolder";
import { useColorModeValue } from '../color-mode'
import SortBar from "../searchbar/sortBar";
import {ViewProps} from "./interfaces"
import ContentLoader from "./contentLoader";
import FolderCreate from "../folder/folderCreate";

export default function ListView(props : ViewProps){
  const textColor = useColorModeValue('black', '#DAE1F6');
  const filebg = useColorModeValue('white', '#2A385B');
  const folderbg = useColorModeValue("#9AB3F2", '#1D263F');

  const folderComponents = props.folders.map(folder => (
    <ListFolder 
      isAllowedEdit={props.isAllowedEdit}
      id={folder.id}
      key={folder.id} 
      foldername={folder.name} 
      date={folder.date_modified}
      clickEvent={props.clickEvent}
    />
  ))
  
  const fileComponents = props.files.map(file => (
    <ListItem 
    isAllowedEdit={props.isAllowedEdit}
    parent_folder={file.parent_folder}
    key={file.id} 
    id={file.original_file} 
    filename={file.name} 
    filetype={file.filetype} 
    media={file.media_type}
    tags={file.tags}
    image={file.data} 
    date={file.date_created} 
    created_by={file.employee} 
    submitEvent={props.submitEvent}
    lastUpdatedItem={props.lastUpdatedItem}/>
  ))

  return (<>
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
        color={textColor}
        size={"2xl"}
        >Folders</Heading>
      </HStack>

      <SortBar onChange={props.sortFolderEvent} sortOptions={[
        { label : "Filename", value : "name"},
        { label : "Last modified", value : "date_modified"}]}/>
    </ HStack>
    
    <Stack
    bg={folderbg}
    pl={8}
    pb={10}>
      {props.isAllowedEdit == true ? (
        <FolderCreate id={props.folderId} name={props.folderName} maxW="79vw" clickEvent={props.clickEvent} />
      ):(
        <></>
      )}
      {folderComponents.length == 0 ? (
        <></>
      ):(
        <ContentLoader 
        loading={props.loading}
        color="white"
        content={folderComponents}
      />
      )}
      
    </Stack>

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
    
    <Stack
    pl={8}
    pb={10}
    bg={filebg}>
      <ContentLoader 
        loading={props.loading}
        color="black"
        content={fileComponents}
      />
    </Stack>
    </>);
}