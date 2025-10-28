import React, { useEffect, useState } from 'react'
import { Flex, Heading,
    Box, Text, IconButton,
    CloseButton,
    Dialog,
    Spacer, Image,
    Center,
    Tabs,
    Grid,
    GridItem,
    Button,
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";

import { useColorModeValue } from '../color-mode'

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
  employee:string;
}

interface GalleryItemProps {
  id: number;
  filename: string;
  filetype: string;
  image: string;
  date: string;
}

function formatBytes (bytes: number,decimals: number) {
  if(bytes == 0) return '0 Bytes';
  var k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function GalleryItem(props : GalleryItemProps) {
  const textColor = useColorModeValue('black', 'white');
  const basicbg = useColorModeValue('white', 'black');
  const contentbg = useColorModeValue('#D9D9D9', '#383838');
  const contentbg2 = useColorModeValue('#383838', '#D9D9D9');
  const buttonbg = useColorModeValue("#79EB99", '#5BB975');
  const buttonbg2 = useColorModeValue("#9AB3F2", '#325ECB');
  const buttonbg3 = useColorModeValue("#F29D9A", '#C04E4A');

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
  console.log('Versions data:', versions);
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
            onClick={handleOpenDialog} // Manually open dialog
            role="button"
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
            <Flex justifyContent={'space-between'}>
              <Text fontFamily="var(--font-roboto)">
                  {props.date}
              </Text>
              <Text fontFamily="var(--font-roboto)" pr={3}>
                  {props.filetype}
              </Text>
            </Flex>
          </Flex>
        </Dialog.Trigger>
            <Dialog.Backdrop
              bg="blackAlpha.700" // Darken background with semi-transparent black
              backdropFilter="blur(2px)" 
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
                    color={textColor}
                    fontSize="xl" 
                    fontWeight="bold"
                    mb={4}>
                      {versions.find((v) => v.version.toString() === selectedVersion.toString())?.name}
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
                      bg={contentbg}
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
                        
                      {/* All File Details */}
                      <Flex
                      w={"35vw"}
                      h={"80vh"}
                      direction={'column'}
                      bg={basicbg}>

                        {/* File Version */}
                        <Tabs.Root
                          w={"100%"}
                          variant="enclosed"
                          activationMode='automatic'
                          fitted
                          defaultValue={versions[0].version.toString()}
                          value={selectedVersion}
                          onValueChange={(v) => setSelectedVersion(v.value)}>
                          <Tabs.List bg={contentbg}>
                            {versions.map((versions: any) => (
                              <Tabs.Trigger 
                              key={versions.version.toString()}
                              color={contentbg2} 
                              value={versions.version.toString()}>
                                Version {versions.version}
                              </Tabs.Trigger>
                            ))}
                          </Tabs.List>

                          {versions.map((version: any) => (
                            <Tabs.Content key={version.version.toString()} value={version.version.toString()}>
                              {/* File Details */}
                              <Flex
                                w={'90%'}
                                h={'68vh'}
                                m={8}
                                mb={6}
                                direction={'column'}
                                color={textColor}>

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
                                      <Text h={'30%'}>{formatBytes(version.size,2)}</Text>
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
                                        <Text h={'50%'}>{version.employee.username}</Text>
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
                                        <Text h={'50%'}>{version.employee.username}</Text>
                                      </GridItem>
                                      </>
                                    )}
                                  </Grid>
                                </Flex>

                                <Spacer />

                                {/* Shared Tags */}
                                <Flex w={'100%'} h={'25%'} direction={'column'}>
                                  <Text>Tags:</Text>
                                  <Box
                                    w={'100%'}
                                    h={'100%'}
                                    mt={4}
                                    p={4}
                                    bg={contentbg}>
                                    This Holds all tags that are able to view / edit
                                  </Box>
                                </Flex>

                                <Spacer />
                                
                                <Flex w={'full'} justify={'space-between'}>
                                  <Button bg={buttonbg} w={'48%'}>
                                    Download
                                  </Button>
                                  <Flex w={'45%'} justify={'space-between'}>
                                    <Button bg={buttonbg2} w={'48%'}>
                                      Edit
                                    </Button>
                                    <Button bg={buttonbg3} w={'48%'}>
                                      Delete
                                    </Button>
                                  </Flex>
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
                      bg={contentbg}
                      color={textColor} 
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