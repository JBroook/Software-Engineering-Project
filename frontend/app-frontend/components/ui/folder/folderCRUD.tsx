import { Menu, Icon, Portal } from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useColorModeValue } from "../color-mode";
import { GalleryFolderProps } from "../item/galleryFolder";

export interface folderCRUD {
    id:number;
    folderName:string;
    clickEvent:(data:clickEventProps) => void ;
}

export interface clickEventProps {
    usage : string; 
    folderId : number; 
    folderName : string;
    parent_folder: number | null | undefined;
}

export default function FolderCRUD (props:folderCRUD) {

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
            props.clickEvent(data)
        }
    }

    return(
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
    )
}