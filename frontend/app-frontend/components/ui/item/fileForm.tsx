import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useColorModeValue } from "../color-mode";
import { 
  Button, CloseButton, 
  Dialog, Field, FileUpload, 
  Flex, Float, Heading, 
  Input, NativeSelect, Portal, 
  useFileUploadContext, Badge, 
  useFileUpload} from "@chakra-ui/react";
import { FaFile } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { Folder } from "../viewType/interfaces";

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

type FileFormChildfulProps = React.PropsWithChildren<FileFormProps>;

export default function FileForm(props: FileFormChildfulProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const {register, handleSubmit, setError, formState: {errors}} = useForm<FileProp>({
    defaultValues: {
      parent_folder: props.current_folder || null,
      version: 1,
    }
  });

  const fileUpload = useFileUpload({
    maxFiles: 1,
  })

  const FileUploadList = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0) return null
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
    )
  }

  const onSubmit: SubmitHandler<FileProp> = async (fetched) =>{
    const file = fileUpload.acceptedFiles[0]
    const newFileData: FileProp = {
      usage: "create",
      id: null,
      filename: fetched.filename,
      description: fetched.description,
      parent_folder: props.current_folder || fetched.parent_folder || null,
      data: file, // Single File object
      version: 1, 
    }

    console.log("new File Data:", newFileData)
    if (!newFileData.data) {
      setError("data", { type: "manual", message: "Please upload a file" });
      return;
    }
    
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
    }
  }
  
  return (
    <>
    <Dialog.Root open={isOpen} onOpenChange={(v) => setIsOpen(v.open)}>
      <Dialog.Trigger asChild>
        {props.children}
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
                    
                      <NativeSelect.Root >
                        <Input asChild>
                        <NativeSelect.Field placeholder="Select an option" {...register('parent_folder',)} >
                          {props.folders.map((folder: any) => (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                          )
                          )}
                        </NativeSelect.Field>
                        </Input>
                      </NativeSelect.Root>
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