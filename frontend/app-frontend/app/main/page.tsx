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

const getFolders = async (parentFolder : number) => {
  const res = await fetch(`http://localhost:8000/api/folders/?parent_folder=${parentFolder}`, {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentParent, setCurrentParent] = useState<number>(-1);
  const [folderChain, setFolderChain] = useState<number[]>([]);
  const [nameChain, setNameChain] = useState<string[]>(["All files"]);

  // handles entering a folder when it is clicked
  const openFolder = async (newFolderId: number, newFolderName: string) => {
    let f = await getFolders(newFolderId);
    setFolders(f);

    f = await getFiles(newFolderId);
    setFiles(f);

    const fChain = [...folderChain, currentParent]
    setFolderChain(fChain);
    setCurrentParent(newFolderId);

    const nChain = [...nameChain, newFolderName]
    setNameChain(nChain);
  }

  // goes to previous folder if it exists
  const ascendFolderChain = async () => {
    const fChain = [...folderChain]
    const lastFolderId = fChain.pop();

    if(lastFolderId!==undefined){
      let f = await getFolders(lastFolderId);
      setFolders(f);

      f = await getFiles(lastFolderId);
      setFiles(f);

      setCurrentParent(lastFolderId);
    }
    setFolderChain(fChain);
    const nChain = [...nameChain];
    nChain.pop();
    setNameChain(nChain);
  }

  // fetch current folder's child items, fetch items with no parents if at root folder
  useEffect(()=>{
    const fetchAssets = async () =>{
      let f = await getFolders(currentParent);
      setFolders(f);

      f = await getFiles(currentParent);
      setFiles(f);

      setLoading(false);
    }

    fetchAssets()
  }, []);

  // handles gallery vs list view
  const [searchbar, setSearchbar] = useState(true);
  const [viewType, setViewType] = useState("gallery");
  const view = viewType=="gallery" ? (
      <GalleryView 
        folders={folders} 
        files={files} 
        clickEvent={openFolder}
        loading={loading}
      />
  ) : (
      <ListView 
        folders={folders} 
        files={files} 
        clickEvent={openFolder}
        loading={loading}
      />
  );

  const changeViewType = () => {
    setViewType(viewType=="gallery"?"list" : "gallery" );
  }

  //controls text and arrow color
  const arrowTextColor = useColorModeValue("black", 'white');

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
          {/* Remove back button if in root folder */}
          { (currentParent!=-1) &&
            <IconButton
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={ascendFolderChain}>
              <IoIosArrowBack color={arrowTextColor} size={"md"}/>
            </IconButton>
          }
          {/* file path title */}
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color={arrowTextColor}
          size={"3xl"}
          >{nameChain.join(" / ")}</Heading>
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
                        <Checkbox.Label color={arrowTextColor}>png</Checkbox.Label>
                      </Checkbox.Root>

                      <Checkbox.Root>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={arrowTextColor}>jpg</Checkbox.Label>
                      </Checkbox.Root>

                      <Checkbox.Root>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={arrowTextColor}>gif</Checkbox.Label>
                      </Checkbox.Root>

                      <Checkbox.Root>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label color={arrowTextColor}>mp4</Checkbox.Label>
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

