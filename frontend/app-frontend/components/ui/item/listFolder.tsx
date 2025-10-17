import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";

interface ListFolderProps {
  foldername: string;
  date: string;
}

export default function ListFolder(props : ListFolderProps) {
  return (
    <Box 
        w="95%"
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