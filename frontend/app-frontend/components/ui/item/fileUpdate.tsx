import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useColorModeValue } from "../color-mode";
import { 
  Button, CloseButton, 
  Dialog, Field, FileUpload, 
  Flex, Float, Heading, 
  Input, NativeSelect, Portal, 
  useFileUploadContext, Badge, 
  useFileUpload, Text,
  Box, Image,
  Center,
  Grid,
  GridItem,
  Spacer,
  Tabs,
  VisuallyHidden} from "@chakra-ui/react";
import { FaFile } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { Folder } from "../viewType/interfaces";
import { FileProp } from "./fileForm";
import { getFileDetails } from "./galleryItem";
import { ViewItemProps, Version } from '../viewType/interfaces';
import { promises } from 'fs';

export interface UpdateFileProps{
  filedata: ViewItemProps;
  closeModal: () => void;
  submitEvent: (data: FileProp) => void;
}

type UpdateFileChildfulProps = React.PropsWithChildren<UpdateFileProps>;

export default function UpdateFile(props: UpdateFileChildfulProps) {
  const textColor = useColorModeValue('black', 'white');
  const basicbg = useColorModeValue('white', 'black');
  const contentbg = useColorModeValue('#D9D9D9', '#383838');
  const contentbg2 = useColorModeValue('#383838', '#D9D9D9');
  const buttonbg = useColorModeValue("#79EB99", '#5BB975');
  const buttonbg2 = useColorModeValue("#9AB3F2", '#325ECB');
  const buttonbg3 = useColorModeValue("#F29D9A", '#C04E4A');

  const [selectedFolder, setSelectedFolder] = useState<string>();
  const [versions, setVersions] = useState<Version>(); // Store fetched data
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const {register, handleSubmit, setError, formState: {errors}} = useForm<FileProp>({
    defaultValues: {
      parent_folder: null,
    }
  });

  const fileUpload = useFileUpload({
    maxFiles: 1,
  })

  const handleOpenDialog = async () => {setLoading(true);
    try {
      let data = await getFileDetails(props.filedata.id);
      console.log("current id: ",props.filedata.id)
      console.log("current data: ",data[0])
      setVersions(data[0]);
      console.log("current version: ",versions?.version)
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching file details:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const FileUploadList = () => {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;
    
    console.log("Uploaded File11: ",fileUpload.acceptedFiles[0]);
    return (
      <FileUpload.ItemGroup>
        {files.map((file) => (
          <FileUpload.Item
            w="auto"
            h="50%"
            boxSize="20"
            p="2"
            file={file}
            key={file.name}
          >
            <FileUpload.ItemPreviewImage />
            <Float placement="top-end">
              <FileUpload.ItemDeleteTrigger boxSize="6" layerStyle="fill.solid" 
              bg={basicbg} rounded={12}>
                <LuX />
              </FileUpload.ItemDeleteTrigger>
            </Float>
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
    )
  }

  const onSubmit: SubmitHandler<FileProp> = async (fetched) =>{
    console.log("fetched: ", fetched)
    const files = fileUpload.acceptedFiles[0]
    if (props.filedata.parent_folder) {
      setSelectedFolder(props.filedata.parent_folder.toString())
    }

    console.log(selectedFolder);
    
    if (versions) {

      let newFileData: FileProp = {
        usage: "update",
        id: props.filedata.id,
        filename: fetched.filename,
        description: fetched.description,
        parent_folder: selectedFolder || fetched.parent_folder || null,
        data: files, // Single File object
        version: versions.version + 1, 
      }

      console.log("new File Data:", newFileData)
      // if (!newFileData.data) {
      //   setError("data", { type: "manual", message: "Please upload a file" });
      //   return;
      // }
      
      try{
        await props.submitEvent(newFileData);
        setIsOpen(false);
        props.closeModal();
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
      <Dialog.Trigger asChild onClick={handleOpenDialog}>
        {props.children}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner justifyContent="center" alignItems="center">
          <Dialog.Content
              bg={basicbg}
              w={'90vw'}
              h={'95vh'}
              p={6}
              borderRadius="md"
              borderWidth="2px"
              borderColor={contentbg2}
              boxShadow="lg"
            >
              {isOpen && versions ? (
                <>
                <Dialog.Header>
                  <Dialog.Title 
                  color={textColor}
                  fontSize="xl" 
                  fontWeight="bold"
                  mb={4}>
                    {versions.name}
                  </Dialog.Title>
                </Dialog.Header>

                <Dialog.Body spaceY={4}>
                  <Flex 
                  color={textColor} 
                  align={'center'} justify={'center'} grow={1}
                  >
                    <form onSubmit={(e) => {
                        console.log("Form submit event triggered"); // Debug log
                        handleSubmit(onSubmit)(e);
                      }}>
                        <VisuallyHidden asChild>
                          <input type="number" name="hiddenInput" defaultValue={versions.version} />
                        </VisuallyHidden>
                      <Flex
                      direction={'row'}>
                        <Flex 
                        w={"50vw"} h={"80vh"}
                        p={2}
                        align={'center'} justify={'center'}
                        rounded={'md'}
                        bg={contentbg}
                        overflow={'hidden'}
                        >
                          <Center>
                            <Field.Root mb={4} invalid={!!errors.data} required={false}>
                              <FileUpload.RootProvider
                              value={fileUpload}
                              {...register('data',)}
                              >
                                <FileUpload.HiddenInput required={false}/>
                                <Center>
                                  <FileUpload.Dropzone asChild w='83%' h='75%'>
                                    <Image src={versions.data.toString()} alt="Image" objectFit="contain" borderRadius="md" p={8}/>
                                  </FileUpload.Dropzone>
                                </Center>
                                <FileUploadList />
                              </FileUpload.RootProvider>
                              <Field.ErrorText>{errors.data?.message}</Field.ErrorText>
                            </Field.Root>
                          </Center>
                        </Flex>
                        
                        <Spacer />
                          
                        {/* All File Details */}
                        <Flex
                        w={"35vw"}
                        h={"80vh"}
                        direction={'column'}
                        bg={basicbg}>

                          {/* File Details */}
                          <Flex
                            w={'90%'}
                            h={'68vh'}
                            m={8}
                            mb={6}
                            direction={'column'}
                            color={textColor}>

                            <Field.Root key={0} mb={4} invalid={!!errors['filename']}>
                              <Field.Label>
                                File Name
                              </Field.Label>
                              <Input
                                p={2}
                                {...register('filename')}
                                defaultValue={versions.name}
                                placeholder={versions.name}
                              />
                              <Field.ErrorText> 
                                {errors['filename']?.message}
                              </Field.ErrorText>
                            </Field.Root>

                            <Spacer />

                            <Flex h={'30%'}>
                              <Field.Root key={1} mb={4} invalid={!!errors['description']}>
                                <Field.Label>
                                  Description
                                </Field.Label>
                                <Input
                                  h={'100%'}
                                  p={2}
                                  {...register('description')}
                                  defaultValue={versions.description}
                                  placeholder={versions.description}
                                />
                                <Field.ErrorText> 
                                  {errors['description']?.message}
                                </Field.ErrorText>
                              </Field.Root>
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
                              <Button type="submit" as={'button'} bg={buttonbg} w={'48%'}>
                                Submit
                              </Button>
                              <Button bg={buttonbg3} w={'48%'} onClick={() => {setIsOpen(false)}}>
                                Cancel
                              </Button>
                            </Flex>
                          </Flex>
                        </Flex>
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
                </>
              ) : (
                <Center h="100%">
                  <Text>{loading ? 'Loading...' : 'No data available'}</Text>
                </Center>
              )}

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color={buttonbg2}/>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    </>
  )
}