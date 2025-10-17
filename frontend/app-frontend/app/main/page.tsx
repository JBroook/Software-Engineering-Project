'use client'
import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, Image, Grid,
  GridItem, HStack, Flex, SimpleGrid,
  Separator, IconButton, Input, Popover,
  Text
} from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";
import { IoSearchCircleOutline } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { RiGalleryView2 } from "react-icons/ri";
import { IoIosList } from "react-icons/io";
import { useState } from "react";
import GalleryView from "@/components/ui/viewType/galleryView";
import GalleryFolder from "@/components/ui/item/galleryFolder";
import ListView from "@/components/ui/viewType/listView";

export default function Main() {
  const [searchbar, setSearchbar] = useState(true);
  const [viewType, setViewType] = useState("gallery");
  let view;

  const setView = () => {
    if(viewType=="gallery"){
      view = <GalleryView />
    }else{
      view = <ListView />
    }
  }

  const changeViewType = () => {
    setViewType(viewType=="gallery"?"list" : "gallery" );
    setView
  }

  setView()

  return (
    <Box bg="white" minH="100vh">
      {/* Header box for title, search bar and others */}
      <Flex 
      w="100%"
      h="12vh"
      justify="space-between"
      bg="#9AB3F2"
      >
        <HStack
        ml={8}>
          <IconButton
          cursor="pointer"
          _hover={{ bg: 'gray.100' }}>
            <IoIosArrowBack color="black" size={"md"}/>
          </IconButton>
          {/* file path title */}
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color="black"
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

