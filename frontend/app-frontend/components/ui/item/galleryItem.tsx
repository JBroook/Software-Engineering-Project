import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";

interface GalleryItemProps {
  filename: string;
  date: string;
}

// Main Sidebar Component
export default function GalleryItem(props : GalleryItemProps) {
  return (
    <Flex 
    w="100%"
    aspectRatio="4/3"
    bg="white"
    // h={"2xs"}
    borderRadius={"xl"}
    py={2}
    px={4}
    color="black"
    direction="column"
    justify="space-evenly"
    cursor="pointer"
    _hover={{ bg: 'gray.100' }}
    >
        <Flex justify="space-between">
            <Heading fontFamily="var(--font-reddit-mono)">
                {props.filename}
            </Heading>
            <IconButton
                variant="ghost"
                _hover={{ bg: 'gray.200' }}
                borderRadius="100%">
                <SlOptionsVertical/>
            </IconButton>
            {/* <Image width={2} src="/options_icon.svg" alt="options icon" m={1}/> */}
        </Flex>
        <Box
        borderRadius={"xl"}
        bg="#D9D9D9"
        w="100%"
        h="65%">
            
        </Box>
        <Text fontFamily="var(--font-roboto)">
            {props.date}
        </Text>
    </Flex>
  )
}