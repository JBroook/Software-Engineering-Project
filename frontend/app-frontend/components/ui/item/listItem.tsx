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
    GridItem,
    Button
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from '../color-mode';
import { Version, ViewItemProps } from '../viewType/interfaces';
import DeleteFile from './fileDelete';
import UpdateFile from './fileUpdate';
import VideoOnHover from '../preview/videoPreview';
import ModelPreview from '../preview/model3dPreview';
import { toaster } from '../toaster';

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

function formatBytes (bytes: number,decimals: number) {
  if(bytes == 0) return '0 Bytes';
  var k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function ListItem(props : ViewItemProps) {
  const textColor = useColorModeValue('black', '#F9FBFF');
  const basicbg = useColorModeValue('white', '#1A1F2B');
  const contentbg = useColorModeValue('#F5F5F5', '#0E1117');
  const contentbg2 = useColorModeValue('#0E1117', '#D9D9D9');
  const buttonbg = useColorModeValue("#79EB99", '#5BB975');
  const buttonbg2 = useColorModeValue("#9AB3F2", '#325ECB');

  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("0");
  const [versions, setVersions] = useState<Version[] | null>(); // Store fetched data
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = async () => {
    setLoading(true);
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
  
  if (props.lastUpdatedItem == props.id) {
    handleOpenDialog()
  }
  
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
              bg={useColorModeValue("white", "#374466")}
              color={textColor}
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
                      color={textColor}
                      size={25}/>
                  <Box h="fit-content">
                    <Heading fontFamily="var(--font-reddit-mono)">
                      {props.filename}
                    </Heading>
                    <Text fontFamily="var(--font-roboto)" justifySelf={'left'} pl={4}>
                      {props.filetype}
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
                    <Text>{props.created_by.username}</Text>
                  </Flex>
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
              background="#626262"
              >
                <Center>
                  {props.image ? (
                    <>
                      {props.media == "image" ? (
                        <Image w={'full'} h={'full'} src={props.image} alt="Image" objectFit="contain" borderRadius="md" />
                      ): props.media == "video" || props.media == "audio" ? (
                        <>
                        <VideoOnHover src={props.image} mediatype={props.media}/>
                        </>
                      ): props.media == "application" ?(
                        <ModelPreview src={props.image}/>
                      ): (
                        <Box><Text>Item cannot be shown. Please Contact Customer Service.</Text></Box>
                      )}
                    </>
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
            bg={useColorModeValue('white','#1A1F2B')}
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
                  {versions.find((v) => v.version.toString() === selectedVersion.toString())?.data ? (
                    <>
                      {props.media == "image" ? (
                        <Image w={'full'} h={'full'} src={versions.find((v) => v.version.toString() === selectedVersion.toString())?.data.toString()} alt="Image" objectFit="contain" borderRadius="md" />
                      ): props.media == "video" || props.media == "audio" ? (
                        <>
                        <VideoOnHover src={versions.find((v) => v.version.toString() === selectedVersion.toString())?.data.toString()} mediatype={props.media}/>
                        </>
                      ): props.media == "application" ?(
                        <ModelPreview src={versions.find((v) => v.version.toString() === selectedVersion.toString())?.data.toString()}/>
                      ): (
                        <Box><Text>Item cannot be shown. Please Contact Customer Service.</Text></Box>
                      )}
                    </>
                  ) : (
                    <Box>No logo uploaded</Box>
                  )}
                </Flex>

                <Spacer />

                <Flex
                  w={"35vw"}
                  h={"80vh"}
                  direction={'column'}
                  bg={basicbg}>

                  {/* File Version */}
                  <Tabs.Root
                    w={"100%"}
                    variant="enclosed"
                    fitted
                    defaultValue={versions[0].version.toString()}
                    value={selectedVersion}
                    onValueChange={(v) => setSelectedVersion(v.value)}>
                    <Tabs.List bg={contentbg}>
                      {versions.map((versions: any) => (
                        <Tabs.Trigger 
                        key={versions.version}
                        color={contentbg2} 
                        value={versions.version.toString()}>
                          Version {versions.version.toString()}
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

                          <Flex h={'35%'} direction={'column'}>
                            <Grid w={'100%'} h={'25%'} templateColumns="repeat(5, 1fr)" gap={4}>
                              <GridItem colSpan={2}>
                                <Text h={'30%'}>File Name:</Text>
                              </GridItem>
                              <GridItem colSpan={3}>
                                <Text h={'30%'}>{version.name}</Text>
                              </GridItem>
                            </Grid>
                            <Flex direction={'column'} h={'100%'}>
                                <Text h={'20%'}>Description:</Text>
                                <Text h={'70%'} bg={contentbg} rounded={6} p={4}>{version.description}</Text>
                            </Flex>
                          </Flex>

                          <Spacer />

                          <Flex h={'15%'}>
                            <Grid w={'100%'} templateColumns="repeat(5, 1fr)" gap={4}>
                              <GridItem colSpan={2}>
                                <Text h={'50%'}>File Type:</Text>
                                <Text h={'50%'}>File Size:</Text>
                              </GridItem>
                              <GridItem colSpan={3}>
                                <Text h={'50%'}>{version.filetype}</Text>
                                <Text h={'50%'}>{formatBytes(version.size,2)}</Text>
                              </GridItem>
                            </Grid>
                          </Flex>

                          <Spacer />

                          {/* File Created / Modified */}
                          <Flex h={'15%'}>
                            <Grid w={'100%'} templateColumns="repeat(5, 1fr)" gap={4}>
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
                            <Text h={'20%'}>Tags:</Text>
                            <Box
                              w={'100%'}
                              h={'70%'}
                              p={4}
                              rounded={6}
                              bg={contentbg}>
                              This Holds all tags that are able to view / edit
                            </Box>
                          </Flex>

                          <Spacer />
                          
                          <Flex w={'full'} justify={'space-between'} mt={4}>
                            <a
                              href={`http://localhost:8000/api/download/?id=${version.id}`}
                              download={true}
                            >
                              <Button
                                w='15vw'
                                bg={buttonbg}
                                onClick={(e) => e.stopPropagation()}
                                size="sm"
                                variant="solid"
                                fontWeight={'bold'}
                                color='black'
                              >
                                Download
                              </Button>
                            </a>

                            <Flex w={'45%'} justify={'space-between'}>
                              {props.isAllowedEdit == true ? (
                                <>
                                <UpdateFile filedata={props} closeModal={()=> setIsOpen(false)} submitEvent={props.submitEvent}>
                                  <Button bg={buttonbg2} w={'48%'}>
                                    Edit
                                  </Button>
                                </UpdateFile>
                                <DeleteFile filedata={props} closeModal={()=> setIsOpen(false)} submitEvent={props.submitEvent} />
                                </>
                              ):(
                                <></>
                              )}
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