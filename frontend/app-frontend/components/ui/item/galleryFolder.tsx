import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";
import { FaFolder } from "react-icons/fa";

interface GalleryFolderProps {
  foldername: string;
  date: string;
}

// Main Sidebar Component
export default function GalleryFolder(props : GalleryFolderProps) {
  return (
    <Box 
    w="100%"
    h="fit-content"
    bg="white"
    // h={"2xs"}
    borderRadius={"xl"}
    py={2}
    px={4}
    color="black"
    cursor="pointer"
    _hover={{ bg: 'gray.100' }}
    >
      <Flex justify="space-between" align="center">
        <HStack>
          <FaFolder 
              color="black"
              size={25}/>
          <Box h="fit-content">
            <Heading fontFamily="var(--font-reddit-mono)">
              {props.foldername}
            </Heading>
            <Text fontFamily="var(--font-roboto)">
              {props.date}
            </Text>
          </Box>
        </HStack>
        <IconButton
            variant="ghost"
            _hover={{ bg: 'gray.200' }}
            borderRadius="100%">
            <SlOptionsVertical/>
        </IconButton>
      </Flex>
        
    </Box>
  )
}