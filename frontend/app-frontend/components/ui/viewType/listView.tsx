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

export default function ListView(props : ViewProps){
  const folderComponents = props.folders.map(folder => (
      <ListFolder 
        key={folder.id} 
        foldername={folder.name} 
        date={folder.date_modified}
        clickEvent={() => props.clickEvent(folder.id, folder.name)}
      />
    ))
  
  const fileComponents = props.files.map(file => (
    <ListItem key={file.id} id={file.original_file} filename={file.name} image={file.data} date={file.date_modified} size={file.size}/>
  ))

  return (<>
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
        color={useColorModeValue("black", 'white')}
        size={"2xl"}
        >Folders</Heading>
      </HStack>

      <SortBar onChange={props.sortFolderEvent} sortOptions={[
        { label : "Filename", value : "name"},
        { label : "Last modified", value : "date_modified"}]}/>
    </ HStack>
    
    <Stack
    bg={useColorModeValue("#9AB3F2", '#335098')}
    pl={8}
    pb={3}>
      <ContentLoader 
        loading={props.loading}
        color="white"
        content={folderComponents}
      />
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

      <SortBar onChange={props.sortFileEvent} sortOptions={[
        { label : "Filename", value : "name"},
        { label : "Size", value : "size"},
        { label : "Last modified", value : "date_modified"}]}/>
    </Flex>
    
    <Stack
    pl={8}
    pb={10}
    bg={useColorModeValue("white", '#0D1835')}>
      <ContentLoader 
        loading={props.loading}
        color="black"
        content={fileComponents}
      />
    </Stack>
    </>);
}