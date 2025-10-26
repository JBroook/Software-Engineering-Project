import React, { useEffect, useState } from 'react'
import { Flex, Heading,
    Box, Text, HStack, IconButton,
    Center, Image,
    CloseButton,
    Dialog,
    Grid,
    Spacer,
    Tabs,
    Portal,
    Tooltip,
    GridItem
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from '../color-mode';

const getFileDetails = async (currentID: number):Promise<Version[]> => {
  const res = await fetch(`http://localhost:8000/api/files/?file=${currentID}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch file details');
  }

  const data = await res.json();
  console.log(data)

  // If API returns a single object, wrap it in an array
  return Array.isArray(data) ? data : [data];
}
interface Version {
  version: number;
  name: string;
  filetype: string;
  size: string;
  date_created: string;
  created_by: string;
  data: string;
}
interface ListItemProps {
  id: number;
  filename: string;
  size: number;
  image: string;
  date: string;
}

export default function ListItem(props : ListItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("0");
  const [versions, setVersions] = useState<Version[] | null>(); // Store fetched data
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = async () => {setLoading(true);
    try {
      const data = await getFileDetails(props.id);
      setVersions(data);
      setSelectedVersion(data[0]?.version?.toString() || '1');
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching file details:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  console.log('Versions State:', versions);
  console.log("Current Version: ",selectedVersion)
  }, [versions,selectedVersion]);
  
  return (
    <>
      <Dialog.Root 
      size="cover" 
      placement="center"
      open={isOpen}
      onOpenChange={(v) => setIsOpen(v.open)}
      trapFocus={true}
      >
        <Tooltip.Root positioning={{ placement: "top" }}>
          <Tooltip.Trigger> {/* To show image preview content in tooltip */}
            <Box
              w="95%"
              h="fit-content"
              bg={useColorModeValue("white", "#383838")}
              color={useColorModeValue("black", "white")}
              borderRadius="xl"
              py={2}
              px={4}
              cursor="pointer"
              _hover={{ bg: useColorModeValue("gray.200", "#2a2a2a") }}
              boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
              onClick={handleOpenDialog} // Manually open dialog
              role="button"
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
                      <Text>{props.size}</Text> {/* change to created by */}
                    </Flex>

                    <SlOptionsVertical/>
                  </HStack>
                </Flex>
              </Box>
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
            {isOpen && versions && !loading ? (
            <>
            <Dialog.Header>
              <Dialog.Title
                color={useColorModeValue('black', 'white')}
                fontSize="xl"
                fontWeight="bold"
                mb={4}>
                {props.filename}
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
                  bg={useColorModeValue('#D9D9D9', '#383838')}
                  overflow={'hidden'}>
                  <Center>
                    {versions.find((v) => v.version.toString() === selectedVersion.toString())?.data ? (
                      <Image src={versions.find((v) => v.version.toString() === selectedVersion.toString())?.data} alt="Image" objectFit="contain" borderRadius="md" />
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
                  bg={useColorModeValue('white', 'black')}>

                  {/* File Version */}
                  <Tabs.Root
                    w={"100%"}
                    variant="enclosed"
                    fitted
                    defaultValue={"v1"}
                    value={selectedVersion}
                    onValueChange={(v) => setSelectedVersion(v.value)}>
                    <Tabs.List bg={useColorModeValue('#D9D9D9', '#383838')}>
                      {versions.map((versions: any) => (
                        <Tabs.Trigger 
                        key={versions.version}
                        color={useColorModeValue('#383838', '#D9D9D')} 
                        value={versions.version}>
                          Version {versions.version}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>

                    {versions.map((version: any) => (
                      <Tabs.Content value={version.version}>
                        {/* File Details */}
                        <Flex
                          w={'90%'}
                          h={'68vh'}
                          m={8}
                          mb={6}
                          direction={'column'}
                          color={useColorModeValue("black", 'white')}>

                          <Flex h={'30%'}>
                            <Grid w={'100%'} templateColumns="repeat(5, 1fr)" gap={4}>
                              <GridItem colSpan={2}>
                                <Text h={'30%'}>File Name:</Text>
                                <Text h={'30%'}>File Type:</Text>
                                <Text h={'30%'}>File Size:</Text>
                              </GridItem>
                              <GridItem colSpan={3}>
                                <Text h={'30%'}>{version.name}</Text>
                                <Text h={'30%'}>{version.filetype}</Text>
                                <Text h={'30%'}>{version.size}</Text>
                              </GridItem>
                            </Grid>
                          </Flex>

                          <Spacer />

                          {/* File Created / Modified */}
                          <Flex h={'25%'}>
                            <Grid w={'100%'} templateColumns="repeat(5, 1fr)" gap="4">
                              {version.version == 1 ? (
                                <>
                                <GridItem colSpan={2}>
                                  <Text h={'50%'}>Created On:</Text>
                                  <Text h={'50%'}>Modified By:</Text>
                                </GridItem>
                                <GridItem colSpan={3}>
                                  <Text h={'50%'}>{version.date_created}</Text>
                                  <Text h={'50%'}>{version.created_by}</Text>
                                </GridItem>
                                </>
                              ) : (
                                <>
                                <GridItem colSpan={2}>
                                  <Text h={'50%'}>Last Modified:</Text>
                                  <Text h={'50%'}>Modified By:</Text>
                                </GridItem>
                                <GridItem colSpan={3}>
                                  <Text h={'50%'}>{version.date_created}</Text>
                                  <Text h={'50%'}>{version.created_by}</Text>
                                </GridItem>
                                </>
                              )}
                            </Grid>
                          </Flex>

                          <Spacer />

                          {/* Shared Tags */}
                          <Flex w={'100%'} h={'30%'} direction={'column'}>
                            <Text>Tags:</Text>
                            <Box
                              w={'100%'}
                              h={'100%'}
                              mt={4}
                              p={4}
                              bg={useColorModeValue('#D9D9D9', '#383838')}>
                              This Holds all tags that are able to view / edit
                            </Box>
                          </Flex>
                        </Flex>
                      </Tabs.Content>
                    ))}
                  </Tabs.Root>

                </Flex>
              </Flex>
            </Dialog.Body>
            <Dialog.CloseTrigger top="0" insetEnd="-12" asChild>
              <CloseButton
                bg={useColorModeValue("white", '#383838')}
                color={useColorModeValue("black", 'white')}
                size="sm" />
            </Dialog.CloseTrigger>
            </>
            ) : (
              <Center h="100%">
                <Text>{loading ? 'Loading...' : 'No data available'}</Text>
              </Center>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  )
}