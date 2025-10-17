import React, { ReactNode } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";

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
        bg="white"
        // h={"2xs"}
        borderRadius={"xl"}
        py={2}
        px={4}
        color="black"
        cursor="pointer"
        _hover={{ bg: 'gray.100' }}
        boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
        >
          <Flex justify="space-between" align="center">
            <HStack>
              <FaFile
                  color="black"
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
                  _hover={{ bg: 'gray.200' }}
                  borderRadius="100%">
                  <SlOptionsVertical/>
              </IconButton>
            </HStack>
          </Flex>
            
        </Box>
  )
}