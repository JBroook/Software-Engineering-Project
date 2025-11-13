import { Menu, Icon, Portal, 
    Button, CloseButton, Dialog, 
    Heading, HStack, Spinner, 
    Stack, Text
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from "../color-mode";
import { GalleryFolderProps } from "../item/galleryFolder";
import { FaUser } from "react-icons/fa";
import { useState } from "react";

export interface folderCRUD {
    id:number;
    folderName:string;
    clickEvent:(data:clickEventProps) => void ;
}

export interface clickEventProps {
    usage : string; 
    folderId : number | null | undefined; 
    folderName : string;
    parent_folder: number | null | undefined;
}

export default function FolderCRUD (props:folderCRUD) {
    const iconTextColor = useColorModeValue("black", "white");
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [clickedDelete, setClickedDelete] = useState<boolean>(false);

    const handleCRUD = (value:string) => {
        const data = {
            'usage': value,
            'folderId': props.id,
            'folderName': props.folderName,
            'parent_folder': null
        }
        if (value == "rename") {
            props.clickEvent(data)
        }else if (value == "delete"){
            setIsOpen(true)
        }
    }

    const deleteFolder = () => {
        const data = {
            'usage': 'delete',
            'folderId': props.id,
            'folderName': props.folderName,
            'parent_folder': null
        }
        props.clickEvent(data)
    }

    return(
        <>
        <Menu.Root positioning={{ placement: "top" }} onSelect={(v) => handleCRUD(v.value)}>
            <Menu.Trigger rounded="full" focusRing="outside">
                <Icon
                    _hover={{ bg: useColorModeValue("gray.300", '#202020ff') }}
                    borderRadius="100%" >
                    <SlOptionsVertical />
                </Icon>
            </Menu.Trigger>
            <Portal>
            <Menu.Positioner>
                <Menu.Content p={3} marginBottom={2}>
                <Menu.Item value="rename" p={3}>Edit</Menu.Item>
                <Menu.Item value="delete" p={3} color="fg.error" _hover={{ bg: "bg.error", color: "fg.error" }}
                >
                    Delete...
                </Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
            </Portal>
        </Menu.Root>
        <Dialog.Root open={isOpen} onOpenChange={(details)=>setIsOpen(details.open)}>
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
                    <Heading fontFamily="var(--font-roboto-condensed)">Delete this Folder?</Heading>
                </HStack>
                </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
            color={iconTextColor} w="100%">
                <Stack w="100%" align="center" px={2}>
                    <Text textAlign="center">
                        Are you sure you want to delete "{props.folderName}"? This action is permanent.
                    </Text>
                    { !clickedDelete ?
                        <Button bg={useColorModeValue("#F29D9A", '#C04E4A')} w={'48%'} onClick={deleteFolder}>
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