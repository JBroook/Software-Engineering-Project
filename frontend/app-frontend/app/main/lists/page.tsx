"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import GalleryItem from "@/components/ui/item/galleryItem"
import { Box, Button, CloseButton, Dialog, Flex, Heading, IconButton, Spacer, Text } from "@chakra-ui/react";
import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";

export default function ListsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box p={4}>AH</Box>
      <Dialog.Root 
        size="cover" 
        placement="center"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        trapFocus // Ensures focus stays in dialog
        // closeOnOverlayClick // Closes dialog when clicking backdrop
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
                    AHHHH                      
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
              <Text>
                  Wednesday 22/10/2025
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
  );
}