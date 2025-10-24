import React, { useState } from 'react'
import { Flex, Heading,
    Box, Text, HStack, IconButton,
    Center, Image,
    CloseButton,
    Dialog,
    Grid,
    Spacer,
    Tabs,
    Portal,
    Tooltip
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from '../color-mode'

interface ListItemProps {
  filename: string;
  image: string;
  date: string;
  size: number;
}

export default function ListItem(props : ListItemProps) {
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
        <Tooltip.Root positioning={{ placement: "top" }}>
          <Tooltip.Trigger> {/* To show image preview content in tooltip */}
            <Dialog.Trigger w='full'> {/* To show Item content in dialog */}
              <Box 
              w="95%"
              h="fit-content"
              bg={useColorModeValue("white", '#383838')}
              color={useColorModeValue("black", 'white')}
              borderRadius={"xl"}
              py={2}
              px={4}
              cursor="pointer"
              _hover={{ bg: useColorModeValue("gray.200", '#2a2a2a') }}
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

                    <SlOptionsVertical/>
                  </HStack>
                </Flex>
              </Box>
          
            </Dialog.Trigger>
          </Tooltip.Trigger>

          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              <Flex
              w='10vw'
              h='10vw'
              align={'center'}
              justify={'center'}
              overflow='hidden'
              >
                <Center>
                  {props.image ? (
                    <Image w={'full'} h={'full'} src={props.image} alt="Image" objectFit="contain" borderRadius="md" />
                  ) : (
                    <Box>No logo uploaded</Box>
                  )}
                </Center>
              </Flex>
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>

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
                    <Image src={props.image} alt="Image" objectFit="contain" borderRadius="md" />
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