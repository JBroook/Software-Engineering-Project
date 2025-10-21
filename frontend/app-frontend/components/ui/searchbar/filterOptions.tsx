import {
  Stack, IconButton,Popover, Checkbox,
  Menu, Button, Portal
} from "@chakra-ui/react"
import { IoFilter } from "react-icons/io5";
import { useColorModeValue } from "../color-mode";
import { useState } from "react";
import MiniPopover from "./miniPopover";


interface FilterOptionsProps {
    iconTextColor : string;
    mediaTypeEvent : (mediaTypes : string[]) => void;
    fileExtensionEvent : (fileExtensions : string[]) => void;
}


export default function FilterOptions(props : FilterOptionsProps){
    const [mediaTypes, setMediaTypes] = useState<string[]>([]);
    const handleMediaClick = (newMediaTypes : string[]) => {
        setMediaTypes(newMediaTypes);
        props.mediaTypeEvent(newMediaTypes);
    }

    const [extensionTypes, setExtensionTypes] = useState<string[]>([]);
    const handleExtensionClick = (newExtensions : string[]) => {
        setExtensionTypes(newExtensions);
        props.fileExtensionEvent(newExtensions);
    }

    return (<>
        <Popover.Root>
            <Popover.Trigger asChild>
            <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
                _hover={{ bg: '#e0e0e0ff' }}>
                <IoFilter color="#9AB3F2"/>
            </IconButton>
            </Popover.Trigger>
            <Popover.Positioner>
            <Popover.Content>
                <Popover.CloseTrigger />
                <Popover.Arrow>
                <Popover.ArrowTip />
                </Popover.Arrow>
                <Popover.Body p={3}>
                <Popover.Title color={props.iconTextColor} fontWeight="medium" mb={2}>Filter options</Popover.Title>
                
                <Stack>
                    {/* Media type filtering */}
                    <MiniPopover 
                        iconTextColor={props.iconTextColor}
                        clickEvent={handleMediaClick}
                        label="Media Type"
                        options={[
                            {label : 'Image', value : 'image'},
                            {label : 'Video', value : 'video'},
                            {label : 'Audio', value : 'audio'},
                        ]}
                    />

                    {/* File extension filtering */}
                    <MiniPopover 
                        iconTextColor={props.iconTextColor}
                        clickEvent={handleExtensionClick}
                        label="File Extension"
                        options={[
                            {label : 'png', value : 'png'},
                            {label : 'jpg', value : 'jpg'},
                            {label : 'gif', value : 'gif'},
                            {label : 'mp3', value : 'mp3'},
                            {label : 'mp4', value : 'mp4'},
                        ]}
                    />
                </Stack>

                </Popover.Body>
            </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    </>);
}
