import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, } from "react-hook-form";
import { useColorModeValue } from "../color-mode";
import { 
  Button, CloseButton, 
  Dialog, Field, FileUpload, 
  Flex, Float, Heading, 
  Input, NativeSelect, Portal, 
  useFileUploadContext, Badge, 
  useFileUpload, Text,
  Select,
  createListCollection,
  Span,
  Stack,
  ListCollection,} from "@chakra-ui/react";
import { FaFile } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { Folder } from "../viewType/interfaces";
import { describe } from "node:test";
import { AiFillFileAdd } from "react-icons/ai";

export type FileProp = {
  usage: string;
  id: number | null;
  filename: string;
  description: string;
  parent_folder: string | null;
  data: File | null;
  version: number;
}

interface FileFormProps {
  title: string;
  current_folder: string | null;
  file: FileProp | null;
  folders: Folder[];
  submitEvent: (data: FileProp) => void;
}

const fetchFolders = async () => {
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

type FileFormChildfulProps = React.PropsWithChildren<FileFormProps>;

export default function FileForm(props: FileFormChildfulProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [getFolder, setFolder] = useState<any>();
  const [allFolder, setAllFolder] = useState<[{}]>([{}]);
  const {control, register, handleSubmit, setError, formState: {errors}} = useForm<FileProp>({
    defaultValues: {
      parent_folder: props.current_folder || null,
      version: 1,
    }
  });

  let folderframeworks = createListCollection({items: allFolder})

  const fileUpload = useFileUpload({
    maxFiles: 1,
  })

  const getChain = async (item: any, all_Items: any):Promise<string> => {
    const chain: number[] = [];
    let breadcrumb: string = "All files";
    let current = item;
    while (current?.parent_folder != null) {
      chain.push(current.parent_folder);
      current = all_Items.find((f: any) => f.id === current.parent_folder);
    }

    let i = chain.length;
    let j = 0;
    while (j < i) {
      const folder_name = await getFolderDetails(chain[j])
      breadcrumb = breadcrumb + '/' + folder_name[0].name;
      j++;
    }
    return breadcrumb;
  }

  const handleOpenDialog = async () => {
    try{
      const all_folder = await fetchFolders();
      setFolder(all_folder)
      const fetchedFolder:[{}] = [{}];
      for (const items of all_folder) {
        if (Object.keys(fetchedFolder[0]).length === 0){
          console.log("accessing first element");
          fetchedFolder[0] = {
            label: items.name,
            value: items.id,
            description: getChain(items,all_folder), // Filepath address
          }
        }else{
          fetchedFolder.push({
            label: items.name,
            value: items.id,
            description: getChain(items,all_folder), // Filepath address
          }
          )
        }
      }
      setAllFolder(fetchedFolder)

      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching file details:', error);
    } 
  }

  const FileUploadList = () => {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;
    if (files.length === 0) return null;
    return (
      <FileUpload.ItemGroup>
        {files.map((file) => (
          <FileUpload.Item
            w="auto"
            boxSize="20"
            p="2"
            file={file}
            key={file.name}
          >
            <FileUpload.ItemPreviewImage />
            <Float placement="top-end">
              <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <LuX />
              </FileUpload.ItemDeleteTrigger>
            </Float>
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
    );
  };

  const onSubmit: SubmitHandler<FileProp> = async (fetched) =>{
    const file = fileUpload.acceptedFiles[0];

    const newFileData: FileProp = {
      usage: "create",
      id: null,
      filename: fetched.filename,
      description: fetched.description,
      parent_folder: fetched.parent_folder,
      data: file, // Single File object
      version: 1, 
    };

    if (!newFileData.data) {
      setError("data", { type: "manual", message: "Please upload a file" });
      return;
    };
    
    try{
      await props.submitEvent(newFileData);
      setIsOpen(false);
    } catch (err: any){
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;

        Object.keys(backendErrors).forEach((field) => {
          const message = Array.isArray(backendErrors[field])
            ? backendErrors[field][0]
            : backendErrors[field];
          setError(field as keyof FileProp, { type: "server", message });
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
        <Button bg={useColorModeValue("#335098", '#9AB3F2')} onClick={handleOpenDialog}>
          <AiFillFileAdd />
          Create File
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
                  <Heading fontFamily="var(--font-roboto-condensed)">{props.title}</Heading>
                </Flex>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body w="100%">
              <Flex color={useColorModeValue('black', 'white')} align={'center'} justify={'center'} grow={1}>
                <form onSubmit={(e) => {
                    console.log("Form submit event triggered"); // Debug log
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
                      console.log(selectValue);
                      return(
                      <Select.Root
                        multiple={false}
                        value={selectValue as string[] | undefined}
                        onValueChange={(e) => field.onChange(e.value)}
                        collection={folderframeworks}
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
                              <Select.Content h={'auto'} >
                                {folderframeworks.items.map((folder) => (
                                  // <Text>{framework.label.toString()}</Text>
                                  <Select.Item item={folder} key={folder.value} value={folder.value} bg={'white'}>
                                    <Stack gap="0">
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
                  
                  <Field.Root key={0} mb={4} invalid={!!errors['filename']}>
                    <Field.Label>
                      File Name
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      p={2}
                      {...register('filename', {required : "File Name is required"})}
                      defaultValue={props.file!==null? props.file['filename'] : undefined}
                    />
                    {/* <Field.HelperText /> */}
                    <Field.ErrorText> 
                      {errors['filename']?.message}
                    </Field.ErrorText>
                  </Field.Root>
                  
                  <Field.Root mb={4} invalid={!!errors['description']}>
                    <Field.Label>
                      Description
                    </Field.Label>
                    <Input
                      p={2}
                      {...register('description')}
                      defaultValue={props.file!==null? props.file['description'] : undefined}
                    />
                    {/* <Field.HelperText /> */}
                    <Field.ErrorText> 
                      {errors['description']?.message}
                    </Field.ErrorText>
                  </Field.Root>

                  <Field.Root mb={4} invalid={!!errors.data}>
                    <Field.Label>
                      File Upload
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <FileUpload.RootProvider
                    value={fileUpload}
                    {...register('data',)}
                    >
                      <FileUpload.HiddenInput />
                      <FileUpload.Dropzone asChild>
                        <FileUpload.Label>Drag & drop an image here, or click to select</FileUpload.Label>
                      </FileUpload.Dropzone>
                        <FileUploadList />
                    </FileUpload.RootProvider>
                    <Field.ErrorText>{errors.data?.message}</Field.ErrorText>
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

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color={useColorModeValue("#9AB3F2", '#335098')}/>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    </>
  )
}