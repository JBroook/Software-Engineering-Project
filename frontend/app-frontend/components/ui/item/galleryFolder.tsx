import React, { ReactNode, useState } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, Icon,
    Avatar,
    Menu,
    Portal,
    Spacer,
    IconButton,
    Button,
    Field,
    Input,
    Badge,
    Select,
    Span,
    createListCollection
} from '@chakra-ui/react'
import { SlOptionsVertical } from "react-icons/sl";
import { FaFolder } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import { useColorModeValue } from '../color-mode'
import FolderCRUD, { clickEventProps, folderCRUD } from '../folder/folderCRUD'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { fetchFolders, FolderItem, getFolderDetails } from './fileForm';
import { EditFolder } from '../viewType/interfaces';

export interface GalleryFolderProps {
  isAllowedEdit: boolean;
  id : number;
  foldername: string;
  date: string;
  clickEvent: (data:clickEventProps) => void ;
}

export default function GalleryFolder(props : GalleryFolderProps) {
  const textColor = useColorModeValue('#0D1835', '#F9FBFF');
  const folderbg = useColorModeValue('white', '#374466');
  const buttonbg = useColorModeValue("#9AB3F2", '#335098');
  const buttonbg2 = useColorModeValue("#F29D9A", '#C04E4A');

  const [change, setChange] = useState(false);
  
  const [allFolder, setAllFolder] = useState<FolderItem[]>([]);
  const [currentParent, setCurrentParent] = useState<number|null>();
  const [currentParentIndex, setCurrentParentIndex] = useState<number>(0);
  const {control, register, handleSubmit, setError, formState: {errors}} = useForm<EditFolder>({
    defaultValues: {
      parent_folder: null,
    }
  });

  let folderframeworks = createListCollection({items: allFolder});

  function closeChange () {
    setChange(false)
  }

  const getChain = async (item: any, all_Items: any):Promise<string> => {
    const chain: number[] = [];
    let breadcrumb: string = "All files";
    let current = item;
    while (current?.parent_folder != null) {
      chain.push(current.parent_folder);
      current = all_Items.find((f: any) => f.id === current.parent_folder);
    };

    let i = chain.length;
    let j = 0;
    while (j < i) {
      const folder_name = await getFolderDetails(chain[j])
      breadcrumb = breadcrumb + '/' + folder_name[0].name;
      j++;
    };
    return breadcrumb;
  }

  const onSubmit: SubmitHandler<EditFolder> = async (fetched) =>{
    const newFolderData = {
      'usage': "rename", 
      'folderId': props.id, 
      'folderName': fetched.foldername,
      'parent_folder': fetched.parent_folder == -1? null : (fetched.parent_folder || currentParent)
    }

    console.log("new File Data:", newFolderData);
    
    try{
      props.clickEvent(newFolderData);
      setChange(false)
    } catch (err: any){
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;

        Object.keys(backendErrors).forEach((field) => {
          const message = Array.isArray(backendErrors[field])
            ? backendErrors[field][0]
            : backendErrors[field];
          setError(field as keyof EditFolder, { type: "server", message });
        });
      } else {
        // fallback error handling
        setError("root", { type: "server", message: "An unexpected error occurred." });
      }
    };
  };

  const handleCRUD = async (data:clickEventProps) => {
    if (data.usage == 'rename'){
      try{
        const all_folder = await fetchFolders();
        const fetchedFolder:FolderItem[] = [];
        fetchedFolder.push({
          label: "",
          value: -1,
          description: Promise.resolve(""), // Filepath address
        });
        let index = 0;
        for (const items of all_folder) {
            fetchedFolder.push({
              label: items.name,
              value: items.id,
              description: getChain(items,all_folder), // Filepath address
            })
            if (items.id == props.id) {
              setCurrentParent(items.parent_folder)
              setCurrentParentIndex(index)
            }
            index++;
        };
        setAllFolder(fetchedFolder);
  
        setChange(true);
      } catch (error) {
        console.error('Error fetching file details:', error);
      } 

    } else if (data.usage == 'delete') {
      const data = {
        'usage': "delete", 
        'folderId': props.id, 
        'folderName': props.foldername,
        'parent_folder': null,
      }
      props.clickEvent(data)
    }
  }

  const handleClickEvent = (data:clickEventProps) => {
    props.clickEvent(data)
  }
  
  const openFolder = () => {
    const data = {
      'usage': "access", 
      'folderId': props.id, 
      'folderName': props.foldername,
      'parent_folder': null,
    }
    handleClickEvent(data)
  }

  return (
    <>
    { change ? (
      <Flex 
      w="40vw" 
      bg={folderbg}
      color={textColor}
      borderColor={textColor}
      borderWidth="2px"
      // h={"2xs"}
      borderRadius={"xl"}
      py={2}
      px={4}
      cursor="pointer"
      zIndex={100}
      >
        <Box as="form" w="100%" onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }} >
            <Flex 
              justify="space-between"
              >
              <HStack>
                <Flex mr={2}>
                  <FaFolder 
                    color={textColor}
                    size={25}/>
                </Flex>

                <Field.Root key={0} w="44%" mb={4} invalid={!!errors['foldername']}>
                  <Field.Label>
                    File Name
                  </Field.Label>
                  <Input
                    w="100%"
                    p={2}
                    {...register('foldername')}
                    defaultValue={props.foldername}
                    placeholder={props.foldername}
                  />
                  <Field.ErrorText> 
                    A Name must be given for the Folder
                  </Field.ErrorText>
                </Field.Root>
                      
                <Field.Root key={1} w="44%" mb={4} invalid={!!errors['parent_folder']}>
                  <Field.Label>
                    Parent Folder
                    <Field.RequiredIndicator
                      fallback={
                        <Badge size="xs" variant="surface">
                          Optional
                        </Badge>
                      }
                    />
                  </Field.Label> 
                
                  <Controller
                    control={control}
                    name="parent_folder"
                    render={({ field }) => {
                    const selectValue = field.value ?? undefined;
                    return(
                    <Select.Root 
                      w="100%"
                      multiple={false}
                      value={selectValue as string[] | undefined}
                      onValueChange={(e) => field.onChange(e.value)}
                      collection={folderframeworks}
                      defaultValue={[currentParentIndex.toString()]}
                    >
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Parent Folder" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                          <Select.Content h={'auto'}>
                            {folderframeworks.items.map((folder, index) => (
                              <Select.Item h={'5vh'} item={folder} key={index} color={textColor} >
                                <Stack gap="0" h={'5vh'}>
                                  <Select.ItemText maxW={'10vw'} truncate>{folder.label}</Select.ItemText>
                                  <Span color="fg.muted" textStyle="xs">
                                    {folder.description}
                                  </Span>
                                </Stack>
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  )}} />

                  <Field.ErrorText> 
                    {errors['parent_folder']?.message}
                  </Field.ErrorText>
                </Field.Root>
              </HStack>
              
              <Flex w={'26%'} pt={2} align='center'>
                <Button w={'49%'} h={'45%'} 
                type="submit" as={'button'}
                bg={buttonbg} 
                borderColor={textColor}
                borderWidth="0.5px"
                _hover={{bg : "#8aa0d7ff"}}
                px={3}
                mr={2}
                >
                  <SiTicktick />
                </Button>
                <Spacer />
                <Button w={'49%'} h={'45%'} onClick={closeChange}
                bg={buttonbg2} 
                borderColor={textColor}
                borderWidth="0.5px"
                _hover={{bg : "#df817dff"}}
                px={3}>
                  <MdCancel />
                </Button>
              </Flex>
            </Flex>
        </Box>
      </Flex>
    ) : (
      <Flex 
      w="100%"
      maxW="400px"
      h="fit-content"
      bg={folderbg}
      color={textColor}
      // h={"2xs"}
      borderRadius={"xl"}
      py={2}
      px={4}
      cursor="pointer"
      _hover={{ bg: useColorModeValue("gray.200", '#2a2a2aff') }}
      direction={'row'}
      >
        <Flex justify="space-between" align="center" w={'95%'} onClick={openFolder}>
          <HStack>
            <FaFolder 
                color={textColor}
                size={25}/>
            <Box h="fit-content">
              <Heading fontFamily="var(--font-reddit-mono)" truncate maxWidth="280px" textStyle={'xl'}>
                {props.foldername}
              </Heading>
              <Text fontFamily="var(--font-roboto)" textStyle={'sm'}>
                {props.date}
              </Text>
            </Box>
          </HStack>
        </Flex>
        
          {props.isAllowedEdit == true ? (
            <FolderCRUD id={props.id} folderName={props.foldername} clickEvent={handleCRUD}/>
          ):(
            <></>
          )}
      </Flex>
    )}
    </>
  )
}