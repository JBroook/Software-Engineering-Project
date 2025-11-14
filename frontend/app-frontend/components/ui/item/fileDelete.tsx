import { Button, CloseButton, Dialog, 
    Heading, HStack, Portal, 
    Spinner, Stack, Text
} from "@chakra-ui/react";
import { useColorModeValue } from "../color-mode";
import { UpdateFileProps } from "./fileUpdate";
import { SubmitHandler, useForm } from "react-hook-form";
import { FileProp } from "./fileForm";
import { FaUser } from "react-icons/fa";
import { useState } from "react";

export default function DeleteFile (props: UpdateFileProps){
    const iconTextColor = useColorModeValue("black", "white");
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [clickedDelete, setClickedDelete] = useState<boolean>(false);
    const { setError } = useForm<FileProp>({
        defaultValues: {
        parent_folder: null,
        }
    });
    
    const onSubmit: SubmitHandler<FileProp> = async (newFileData) =>{
        try{
            await props.submitEvent(newFileData);
            props.closeModal();
        } catch (err: any){
                // fallback error handling
                setError("root", { type: "server", message: "An unexpected error occurred." });
        }
    }
    const newFileData: FileProp = {
        usage: "delete",
        id: props.filedata.id,
        filename: "",
        description: "",
        parent_folder: null,
        data: null,
        version: 1, 
        tags:[],
    }

    return (
        <>
          <Dialog.Root open={isOpen} onOpenChange={(details)=>setIsOpen(details.open)}>
          <Dialog.Trigger asChild>
            <Button bg={useColorModeValue("#F29D9A", '#C04E4A')} w={'48%'}>
                Delete
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner justifyContent="center" alignItems="center">
              <Dialog.Content w="25vw" minW="300px" p={4} maxH="70vh">
    
                <Dialog.Header mt={2}>
                  <Dialog.Title 
                    w="100%"
                    color={iconTextColor}>
                    <HStack w="100%" justify="center" mb={3}>
                      <FaUser />
                      <Heading fontFamily="var(--font-roboto-condensed)">Delete this file?</Heading>
                    </HStack>
                  </Dialog.Title>
                </Dialog.Header>
    
                <Dialog.Body
                color={iconTextColor} w="100%">
                    <Stack w="100%" align="center" px={2}>
                        <Text textAlign="center">
                            Are you sure you want to delete "{props.filedata.filename}"? This action is permanent.
                        </Text>
                        { !clickedDelete ?
                            <Button bg={useColorModeValue("#F29D9A", '#C04E4A')} w={'48%'} onClick={() => onSubmit(newFileData)}>
                                Delete
                            </Button>
                            :
                            <Spinner m={3}></Spinner>
                        }
                    </Stack>
                </Dialog.Body>
    
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" color={iconTextColor}/>
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
        </>
    )
}