import React, { ReactNode, useState } from 'react'
import { Stack, Flex, Heading,
    Box, Text, HStack, IconButton,
    createListCollection,
    Badge,
    Button,
    Field,
    Input,
    Select,
    Span,
    Spacer
} from '@chakra-ui/react'
import { FaFolder } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from '../color-mode'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import FolderCRUD, { clickEventProps } from '../folder/folderCRUD';
import { EditFolder } from '../viewType/interfaces';
import { FolderItem, getFolderDetails, fetchFolders } from './fileForm';
import { MdCancel } from 'react-icons/md';
import { SiTicktick } from 'react-icons/si';

interface ListFolderProps {
  id : number;
  foldername: string;
  date: string;
  clickEvent: (data:clickEventProps) => void ;
}

export default function ListFolder(props : ListFolderProps) {
  const textColor = useColorModeValue('black', 'white');
    const basicbg = useColorModeValue('white', '#383838');
    const buttonbg = useColorModeValue("#9AB3F2", '#335098');
    const buttonbg2 = useColorModeValue("#F29D9A", '#C04E4A');
    const contentbg = useColorModeValue('#F5F5F5', '#383838');
  
    const [change, setChange] = useState(false);
    
    const [allFolder, setAllFolder] = useState<FolderItem[]>([]);
    const [currentParent, setCurrentParent] = useState<number|null>();
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
          for (const items of all_folder) {
              fetchedFolder.push({
                label: items.name,
                value: items.id,
                description: getChain(items,all_folder), // Filepath address
              })
              if (items.id == props.id) {
                setCurrentParent(items.parent_folder)
              }
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
      w="100%"
      maxW="74vw"
      h="fit-content"
      bg={basicbg}
      color={textColor}
      // h={"2xs"}
      borderRadius={"xl"}
      py={2}
      px={4}
      cursor="pointer"
      justify={'center'}
      align={'center'}
      >
        <FaFolder 
          color={textColor}
          size={25}/>
        <form onSubmit={(e) => {
          console.log("Folder Form submit event triggered"); // Debug log
          handleSubmit(onSubmit)(e);
        }} >
          <Flex direction={'row'} w='70vw' pl={4} pr={4}>
            <Flex direction={'row'} w='90%'>
              <Field.Root key={0} mb={4} invalid={!!errors['foldername']}>
                <Field.Label>
                  File Name
                </Field.Label>
                <Input
                  w={'80%'}
                  p={2}
                  {...register('foldername')}
                  defaultValue={props.foldername}
                  placeholder={props.foldername}
                />
                <Field.ErrorText> 
                  A Name must be given for the Folder
                </Field.ErrorText>
              </Field.Root>
                  
              <Field.Root key={1} mb={4} invalid={!!errors['parent_folder']}>
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
                  w={'80%'}
                    multiple={false}
                    value={selectValue as string[] | undefined}
                    onValueChange={(e) => field.onChange(e.value)}
                    collection={folderframeworks}
                    defaultValue={['0']}
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
                                <Select.ItemText>{folder.label}</Select.ItemText>
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
            </Flex>
            <Flex  w='10%' direction={'row'} justify={'center'} align={'center'}>
              <Button w={'40%'} h={'50%'} 
              type="submit" as={'button'}
              bg={buttonbg} 
              _hover={{bg : "#8aa0d7ff"}}
              px={3}>
                <SiTicktick />
              </Button>
              <Spacer />
              <Button w={'40%'} h={'50%'} onClick={closeChange}
              bg={buttonbg2} 
              _hover={{bg : "#df817dff"}}
              px={3}>
                <MdCancel />
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
      
    ) : (
      <Flex 
        w="95%"
        maxW="74vw"
        h="fit-content"
        bg={useColorModeValue("white", '#383838')}
        color={useColorModeValue("black", 'white')}
        // h={"2xs"}
        borderRadius={"xl"}
        py={2}
        px={4}
        cursor="pointer"
        _hover={{ bg: useColorModeValue("gray.200", '#2a2a2aff') }}
        direction={'row'}
        >
          <Flex justify="space-between" align="center" onClick={openFolder} w='98%'>
            <HStack>
              <FaFolder
                  color={useColorModeValue("black", 'white')}
                  size={25}/>
              <Box h="fit-content">
                <Heading fontFamily="var(--font-reddit-mono)" truncate maxWidth="60vw">
                  {props.foldername}
                </Heading>
                <Text fontFamily="var(--font-roboto)">
                  {props.date}
                </Text>
              </Box>
            </HStack>
          </Flex>
          <FolderCRUD id={props.id} folderName={props.foldername} clickEvent={handleCRUD}/>
        </Flex>
    )}
    </>
  )
}