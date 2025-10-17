'use client'
import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, Image, Grid,
  GridItem, HStack, Flex, SimpleGrid,
  Stack, IconButton, Input, Popover,
  Text, Checkbox
} from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";
import { IoSearchCircleOutline } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { RiGalleryView2 } from "react-icons/ri";
import { IoIosList } from "react-icons/io";
import { useEffect, useState } from "react";
import GalleryView from "@/components/ui/viewType/galleryView";
import ListView from "@/components/ui/viewType/listView";
import { Folder, File } from "@/components/ui/viewType/interfaces";

const getFolders = async () => {
  const res = await fetch('http://localhost:8000/api/folders/', {
    credentials: 'include',
  });
  const data = await res.json();
  return data;
};

const getFiles = async (currentParent: number) => {
  const res = await fetch(`http://localhost:8000/api/files/?parent_folder=${currentParent}`, {
    credentials: 'include',
  });
  const data = await res.json();
  return data;
};


export default function Main() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentParent, setCurrentParent] = useState(-1);

  const filterFolders = (f: Folder[], currentParent: number) => {
    if(currentParent===-1){
      f = f.filter( (folder : any)=> {
          return folder['parent_folder']===null;
        });
      }else{
        f = folders.filter( (folder)=> {
          return folder['parent_folder']===currentParent;
        });
      }
    return f;
  }

  const openFolder = (newFolderId: number) => {
    setCurrentParent(newFolderId);
    const f = filterFolders(folders, newFolderId);
    console.log(f)
    setFolders(f);
  }

  useEffect(()=>{
    const fetchAssets = async () =>{
      let f = await getFolders();
      //filter out folders not in current parent folder
      f = filterFolders(f, currentParent)
      setFolders(f);

      f = await getFiles(currentParent);
      console.log(f);
      //filter out files not in current parent folder
      if(currentParent===-1){
        f = f.filter( (folder : any)=> {
          return folder['parent_folder']===null;
        });
      }else{
        f = folders.filter( (folder)=> {
          return folder['parent_folder']===currentParent;
        });
      }
      setFiles(f);
    }

    fetchAssets()
  }, []);

  const [searchbar, setSearchbar] = useState(true);
  const [viewType, setViewType] = useState("gallery");
  let view;

  const setView = () => {
    if(viewType=="gallery"){
      view = <GalleryView folders={folders} files={files} clickEvent={openFolder}/>
    }else{
      view = <ListView folders={folders} files={files} /*clickEvent={openFolder}*//>
    }
  }

  const changeViewType = () => {
    setViewType(viewType=="gallery"?"list" : "gallery" );
    setView
  }

  setView()

  return (
    <Box bg={useColorModeValue("#9AB3F2", '#335098')} minH="100vh">
      {/* Header box for title, search bar and others */}
      <Flex 
      w="100%"
      h="12vh"
      justify="space-between"
      >
        <HStack
        ml={8}>
          <IconButton
          cursor="pointer"
          _hover={{ bg: 'gray.100' }}>
            <IoIosArrowBack color={useColorModeValue("black", 'white')} size={"md"}/>
          </IconButton>
          {/* file path title */}
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color={useColorModeValue("black", 'white')}
          size={"3xl"}
          >Audio / Animal sounds / Mammal roars</Heading>
        </HStack>

        <HStack mr={10}>
            <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={() => setSearchbar(!searchbar)}>
              <IoSearchCircleOutline color="#9AB3F2" size={"sm"}/>
            </IconButton>
            
            {searchbar && <Searchbar placeholder="Search a file"/>}

            <Popover.Root>
              <Popover.Trigger asChild>
                <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
                  _hover={{ bg: '#e0e0e0ff' }}>
                  <IoFilter color="#9AB3F2"/>
                </IconButton>
              </Popover.Trigger>
              <Popover.Positioner>
                <Popover.Content>
                  <Popover.CloseTrigger />
                  <Popover.Arrow>
                    <Popover.ArrowTip />
                  </Popover.Arrow>
                  <Popover.Body p={3}>
                    <Popover.Title color="black" fontWeight="medium">Filter options</Popover.Title>
                    
                    <Stack>
                      <Checkbox.Root>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={useColorModeValue("black", 'white')}>png</Checkbox.Label>
                      </Checkbox.Root>

                      <Checkbox.Root>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={useColorModeValue("black", 'white')}>jpg</Checkbox.Label>
                      </Checkbox.Root>

                      <Checkbox.Root>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={useColorModeValue("black", 'white')}>gif</Checkbox.Label>
                      </Checkbox.Root>

                      <Checkbox.Root>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={useColorModeValue("black", 'white')}>mp4</Checkbox.Label>
                      </Checkbox.Root>
                    </Stack>

                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>

            <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={changeViewType}>
              {viewType=="gallery"?<RiGalleryView2 color="#9AB3F2"/>:<IoIosList color="#9AB3F2"/>}
            </IconButton>

          </HStack>
      </Flex>

      {view}

    </Box>
  );
}

