import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";
import { FaFolder } from "react-icons/fa";
import { useColorModeValue } from '../color-mode'

interface GalleryFolderProps {
  foldername: string;
  date: string;
}

export default function GalleryFolder(props : GalleryFolderProps) {
  return (
    <Box 
    w="100%"
    h="fit-content"
    bg={useColorModeValue("white", '#383838')}
    color={useColorModeValue("black", 'white')}
    // h={"2xs"}
    borderRadius={"xl"}
    py={2}
    px={4}
    cursor="pointer"
    _hover={{ bg: useColorModeValue("gray.200", '#2a2a2aff') }}
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
            _hover={{ bg: useColorModeValue("gray.300", '#202020ff') }}
            borderRadius="100%">
            <SlOptionsVertical/>
        </IconButton>
      </Flex>
        
    </Box>
  )
}