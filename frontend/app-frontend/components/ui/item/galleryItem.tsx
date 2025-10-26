import React, { useState } from 'react'
import { Flex, Heading,
    Box, Text, IconButton,
    CloseButton,
    Dialog,
    Spacer, Image,
    Center,
    Tabs,
    Grid,
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";

import { useColorModeValue } from '../color-mode'

const getFileDetails = async (currentID: number) => {
  const res = await fetch(`http://localhost:8000/api/files/?file=${currentID}`, {
    credentials: 'include',
  });
  const data = await res.json();
  console.log(res.json)
  return data;
}

interface GalleryItemProps {
  filename: string;
  image: string;
  date: string;
}

export default function GalleryItem(props : GalleryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("v1");
  
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
                <Flex
                borderRadius={"xl"}
                bg="#D9D9D9"
                w="100%"
                h="65%"
                align={'center'}
                justify={'center'}
                overflow={'hidden'}>
                  <Center>
                    {props.image ? (
                      <Image w={'full'} h={'full'} src={props.image} alt="Image" objectFit="contain" borderRadius="md" />
                    ) : (
                      <Box>No logo uploaded</Box>
                    )}
                  </Center>
                </Flex>
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
                borderWidth="2px"
                borderColor={useColorModeValue('#D9D9D9','#999999')}
                boxShadow="lg"
              >
                <Dialog.Header>
                  <Dialog.Title 
                  color={useColorModeValue('black','white')}
                  fontSize="xl" 
                  fontWeight="bold"
                  mb={4}>
                    Test Dialog
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body spaceY={4}>
                <Flex direction={"row"}>
                  <Flex 
                  w={"50vw"}
                  h={"80vh"}
                  p={2}
                  align={'center'}
                  justify={'center'}
                  rounded={'md'}
                  bg={useColorModeValue('#D9D9D9','#383838')}
                  overflow={'hidden'}>
                    <Center>
                      {props.image ? (
                        <Image w={'full'} h={'full'} src={props.image} alt="Image" objectFit="contain" borderRadius="md" />
                      ) : (
                        <Box>No logo uploaded</Box>
                      )}
                    </Center>
                  </Flex>
                  
                  <Spacer />

                  <Flex
                  w={"35vw"}
                  h={"80vh"}
                  direction={'column'}
                  bg={useColorModeValue('white','black')}>

                    {/* File Version */}
                    <Flex w={"100%"}>
                      <Tabs.Root 
                       w={"100%"}
                      variant="enclosed" 
                      fitted 
                      defaultValue={"v1"}
                      value={selectedVersion}
                      onValueChange={(v) => setSelectedVersion(v.value)}>
                        <Tabs.List bg={useColorModeValue('#D9D9D9','#383838')}>
                          <Tabs.Trigger color={useColorModeValue('#383838','#D9D9D')} value="v1">Version 1</Tabs.Trigger>
                          <Tabs.Trigger color={useColorModeValue('#383838','#D9D9D')} value="v2">Version 2</Tabs.Trigger>
                          <Tabs.Trigger color={useColorModeValue('#383838','#D9D9D')} value="v3">Version 3</Tabs.Trigger>
                        </Tabs.List>
                      </Tabs.Root>
                    </Flex>

                    {/* File Details */}
                    <Flex 
                    w={'90%'} 
                    h={'100%'} 
                    m={8}
                    mb={6}
                    direction={'column'} 
                    justify={'space-between'}
                    color={useColorModeValue("black", 'white')}>

                      <Flex w={'100%'} justify={'space-between'}>
                        <Grid templateColumns="repeat(2, 1fr)" gap="4">
                          { props.filename ? (
                            <>
                              <Text>File Name:</Text>
                              <Text>{props.filename}</Text>
                              
                              <Text>File Type:</Text>
                              <Text>REMEMBER TO Change this</Text>

                              <Text>File Size:</Text>
                              <Text>REMEMBER TO Change this</Text>
                            </>
                          ):(
                            <>
                              <Text>File Name:</Text>
                              <Text>Name Not Found</Text>
                              
                              <Text>File Type:</Text>
                              <Text>REMEMBER TO Change this</Text>

                              <Text>File Size:</Text>
                              <Text>REMEMBER TO Change this</Text>
                            </>
                            )}

                          <Text></Text>
                        </Grid>
                      </Flex>

                      {/* File Created / Modified */}
                      <Flex w={'100%'}>
                        <Grid templateColumns="repeat(2, 1fr)" gap="4">
                          { props.filename ? (
                            <>
                              <Text>Created On:</Text>
                              <Text>REMEMBER TO Change this</Text>
                              
                              <Text>Last Modified:</Text>
                              <Text>REMEMBER TO Change this</Text>

                              <Text>Modified By:</Text>
                              <Text>REMEMBER TO Change this</Text>
                            </>
                          ):(
                            <>
                              <Text>Created On:</Text>
                              <Text>REMEMBER TO Change this</Text>
                              
                              <Text>Last Modified:</Text>
                              <Text>REMEMBER TO Change this</Text>

                              <Text>Modified By:</Text>
                              <Text>REMEMBER TO Change this</Text>
                            </>
                            )}
                        </Grid>
                      </Flex>
                      
                      {/* Shared Tags */}
                      <Flex w={'100%'} h={'30%'} direction={'column'}>
                        <Text>Tags:</Text>
                        <Box 
                        w={'100%'} 
                        h={'100%'} 
                        mt={4}
                        p={4}
                        bg={useColorModeValue('#D9D9D9','#383838')}>
                          This Holds all tags that are able to view / edit 
                        </Box>
                      </Flex>

                    </Flex>
                  </Flex>
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