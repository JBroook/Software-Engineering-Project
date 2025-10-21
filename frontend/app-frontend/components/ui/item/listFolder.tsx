import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from '../color-mode'
interface ListFolderProps {
  foldername: string;
  date: string;
  clickEvent: () => void ;
}

export default function ListFolder(props : ListFolderProps) {
  return (
    <Box 
        w="95%"
        h="fit-content"
        bg={useColorModeValue("white", '#383838')}
        color={useColorModeValue("black", 'white')}
        // h={"2xs"}
        borderRadius={"xl"}
        py={2}
        px={4}
        cursor="pointer"
        _hover={{ bg: useColorModeValue("gray.200", '#2a2a2aff') }}
        onClick={props.clickEvent}
        >
          <Flex justify="space-between" align="center">
            <HStack>
              <FaFolder
                  color={useColorModeValue("black", 'white')}
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