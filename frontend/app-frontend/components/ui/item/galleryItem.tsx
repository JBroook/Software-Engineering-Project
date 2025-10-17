import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";

import { useColorModeValue } from '../color-mode'

interface GalleryItemProps {
  filename: string;
  date: string;
}

export default function GalleryItem(props : GalleryItemProps) {
  return (
    <Flex 
    w="100%"
    aspectRatio="4/3"
    bg={useColorModeValue("white", '#383838')}
    color={useColorModeValue("black", 'white')}
    // h={"2xs"}
    borderRadius={"xl"}
    py={2}
    px={4}
    direction="column"
    justify="space-evenly"
    cursor="pointer"
    _hover={{ bg: useColorModeValue("gray.200", '#2a2a2aff') }}
    boxShadow="0 0 20px rgba(0, 0, 0, 0.2)"
    >
        <Flex justify="space-between">
            <Heading fontFamily="var(--font-reddit-mono)">
                {props.filename}
            </Heading>
            <IconButton
                variant="ghost"
                _hover={{ bg: useColorModeValue("gray.300", '#202020ff') }}
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