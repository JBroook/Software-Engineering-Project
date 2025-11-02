import { createListCollection, useFileUpload, useFileUploadContext, FileUpload, Float, Dialog, Button, Portal, Flex, Heading, Field, Badge, Select, Stack, Span, Input, CloseButton } from "@chakra-ui/react";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AiFillFileAdd, AiFillFolderAdd } from "react-icons/ai";
import { FaFile } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { useColorModeValue } from "../color-mode";
import { FileProp, fetchFolders } from "../item/fileForm";
import { clickEventProps } from "./folderCRUD";

interface folderCRUD {
    clickEvent:(data:clickEventProps) => void ;
}

export const createFolder = async () => {
  const res = await fetch(`http://localhost:8000/api/folders/`, {
  credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch file details');
  }
  let folders = await res.json();
  return folders
}

export const getFolderDetails = async (currentID: number) => {
  const res = await fetch(`http://localhost:8000/api/folders/?parent_folder=${currentID}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch file details');
  }

  const data = await res.json();

  // If API returns a single object, wrap it in an array
  return Array.isArray(data) ? data : [data];
}

export type FolderItem = {
  value : number;
  label: string;
  description : Promise<string>;
}

export default function FolderCreate(props: folderCRUD) {
  const textColor = useColorModeValue('black', 'white');
  const basicbg = useColorModeValue('white', 'black');
  const contentbg = useColorModeValue('#F5F5F5', '#383838');
  const addbuttonbg = useColorModeValue("#335098", '#9AB3F2');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [allFolder, setAllFolder] = useState<FolderItem[]>([]);
  const {control, register, handleSubmit, setError, formState: {errors}} = useForm<clickEventProps>({
    defaultValues: {
      parent_folder: null,
    }
  });
  
  let folderframeworks = createListCollection({items: allFolder});

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

  const handleOpenDialog = async () => {
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
          }
          )
      };
      console.log(fetchedFolder)
      setAllFolder(fetchedFolder);

      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching file details:', error);
    } 
  }

  const onSubmit: SubmitHandler<clickEventProps> = async (fetched) =>{
      const newFolderData = {
        'usage': "create",
        'folderId': null,
        'folderName': fetched.folderName,
        'parent_folder': fetched.parent_folder == -1? null : fetched.parent_folder
      }
  
      console.log("new File Data:", newFolderData);
      
      try{
        props.clickEvent(newFolderData);
        setIsOpen(false);
      } catch (err: any){
        if (err.response && err.response.data) {
          const backendErrors = err.response.data;
  
          Object.keys(backendErrors).forEach((field) => {
            const message = Array.isArray(backendErrors[field])
              ? backendErrors[field][0]
              : backendErrors[field];
            setError(field as keyof clickEventProps, { type: "server", message });
          });
        } else {
          // fallback error handling
          setError("root", { type: "server", message: "An unexpected error occurred." });
        }
      };
    };

  return (
    <>
    <Dialog.Root open={isOpen} onOpenChange={(v) => setIsOpen(v.open)}>
      <Dialog.Trigger asChild>
        <Button 
            w="100%"
            maxW="400px" 
            h='70px'
            borderRadius={"xl"}
            bg={addbuttonbg}
            >
            <AiFillFolderAdd size={25} color={basicbg}/>
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner justifyContent="center" alignItems="center">
          <Dialog.Content w="30vw" minW="300px" p={4} maxH="70vh" overflowY="scroll">

            <Dialog.Header mt={5}>
              <Dialog.Title 
                w="100%">
                <Flex w="100%" justify="center" align='center' mb={3} color={useColorModeValue("black", "white")}>
                  <FaFile />
                  <Heading fontFamily="var(--font-roboto-condensed)">Create Folder</Heading>
                </Flex>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body w="100%">
              <Flex color={useColorModeValue('black', 'white')} align={'center'} justify={'center'} grow={1}>
                <form onSubmit={(e) => {
                    handleSubmit(onSubmit)(e);
                  }}>
                <Flex direction={'column'} mb={8}>
                    
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
                  
                  <Field.Root key={0} mb={4} invalid={!!errors['folderName']}>
                    <Field.Label>
                      Folder Name
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      p={2}
                      {...register('folderName', {required : "Folder Name is required"})}
                      placeholder="A sample name"
                    />
                    {/* <Field.HelperText /> */}
                    <Field.ErrorText> 
                      {errors['folderName']?.message}
                    </Field.ErrorText>
                  </Field.Root>
                </Flex>
  
                <Flex w="100%" justify="center" mt={2} mb={8} gap={5}>
                  <Button type="submit" as={'button'}
                  bg={useColorModeValue("#9AB3F2", '#335098')} 
                  _hover={{bg : "#8aa0d7ff"}}
                  px={3}
                  >
                    Confirm
                  </Button>
  
                  <Dialog.ActionTrigger asChild>
                    <Button 
                    bg={useColorModeValue("#9AB3F2", '#335098')} 
                    _hover={{bg : "#8aa0d7ff"}}
                    px={3}
                    >Cancel</Button>
                  </Dialog.ActionTrigger>
                </Flex>
                </form>
              </Flex>
            </Dialog.Body>

            <Dialog.CloseTrigger top="0" insetEnd="-12" asChild>
              <CloseButton 
                bg={contentbg}
                color={textColor} 
                size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    </>
  )
}