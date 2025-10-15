import React, { ReactNode } from 'react'
import { Stack, Flex, Image, Heading,
    Box, Text, HStack
} from '@chakra-ui/react'

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
    py={3}
    px={4}
    color="black"
    direction="column"
    justify="space-between"
    >
        <Flex justify="space-between">
            <Heading fontFamily="var(--font-reddit-mono)">
                {props.filename}
            </Heading>
            <Image width={2} src="/options_icon.svg" alt="options icon" m={1}/>
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