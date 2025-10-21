import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from '../color-mode'

interface ListItemProps {
  filename: string;
  date: string;
  size: string;
}

export default function ListItem(props : ListItemProps) {
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
        boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
        >
          <Flex justify="space-between" align="center">
            <HStack>
              <FaFile
                  color={useColorModeValue("black", 'white')}
                  size={25}/>
              <Box h="fit-content">
                <Heading fontFamily="var(--font-reddit-mono)">
                  {props.filename}
                </Heading>
                <Text fontFamily="var(--font-roboto)">
                  file type
                </Text>
              </Box>
            </HStack>

            <HStack fontFamily="var(--font-roboto)" fontSize={14}>
              <Flex mx={2} w="100px" justify="center">
                <Text>Only you</Text>
              </Flex>

              <Flex mx={2} w="200px" justify="center">
                <Text>{props.date}</Text>
              </Flex>

              <Flex mx={2} w="60px" justify="center">
                <Text>{props.size}</Text>
              </Flex>

              <IconButton
                  variant="ghost"
                  _hover={{ bg: useColorModeValue("gray.300", '#202020ff') }}
                  borderRadius="100%">
                  <SlOptionsVertical/>
              </IconButton>
            </HStack>
          </Flex>
            
        </Box>
  )
}