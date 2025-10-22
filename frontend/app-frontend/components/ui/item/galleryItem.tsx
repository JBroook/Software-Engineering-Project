import React, { ReactNode, useState } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton,
    CloseButton,
    Dialog,
    Spacer, Image,
    Center,
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";

import { useColorModeValue } from '../color-mode'

interface GalleryItemProps {
  filename: string;
  image: string;
  date: string;
}

export default function GalleryItem(props : GalleryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  console.log(props.image)
  
  return (
    <>
        <Dialog.Root 
        size="cover" 
        placement="center"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        trapFocus={true}
        >
        
        <Dialog.Trigger asChild>
        <Flex 
            w="100%"
            maxW="400px"
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
                </Flex>
                <Box
                borderRadius={"xl"}
                bg="#D9D9D9"
                w="100%"
                h="65%"
                overflow={'hidden'}>
                  <Center>
                    {props.image ? (
                      <Image w={'90%'} h={'80%'} src={props.image} alt="Image" objectFit="contain" borderRadius="md" />
                    ) : (
                      <Box>No logo uploaded</Box>
                    )}
                  </Center>
                </Box>
                <Text fontFamily="var(--font-roboto)">
                    {props.date}
                </Text>
            </Flex>
          </Dialog.Trigger>
            <Dialog.Backdrop
              bg="blackAlpha.700" // Darken background with semi-transparent black
              backdropFilter="blur(2px)" // Optional: slight blur for polish
            />
            <Dialog.Positioner>
              <Dialog.Content
                bg={useColorModeValue('white','black')}
                w={'90vw'}
                h={'95vh'}
                p={6}
                borderRadius="md"
                boxShadow="lg"
              >
                <Dialog.Header>
                  <Dialog.Title 
                  color={useColorModeValue('black','white')}
                  fontSize="xl" 
                  fontWeight="bold">
                    Test Dialog
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body spaceY={4}>
                  <Flex
                  direction={"row"}>
                    <Box 
                    w={"50vw"}
                    h={"85vh"}
                    bg={useColorModeValue('black','white')}>
                      a
                    </Box>
                    <Spacer />
                    <Box
                    w={"35vw"}
                    h={"85vh"}
                    bg={useColorModeValue('black','white')}>
                      a
                    </Box>
                  </Flex>
                </Dialog.Body>
                <Dialog.CloseTrigger top="0" insetEnd="-12" asChild>
                  <CloseButton 
                    bg={useColorModeValue("white", '#383838')}
                    color={useColorModeValue("black", 'white')} 
                    size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
    </>
  )
}