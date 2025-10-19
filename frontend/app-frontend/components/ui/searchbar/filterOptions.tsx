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
    fileExtensionEvent : () => void;
}


// function FileExtensionPopover(props : PopoverOptionProps){
//     const options = [
//         'jpg',
//         'png',
//         'webp',
//         'gif',
//         'mp4',
//         'mp3'
//     ];
//     const optionCheckboxes = options.map( (option : string, index : number) => 
//         <Checkbox.Root key={index}>
//             <Checkbox.HiddenInput />
//             <Checkbox.Control />
//             <Checkbox.Label color={props.iconTextColor}>{option}</Checkbox.Label>
//         </Checkbox.Root>
//     );

//     return (
//     <Popover.Root positioning={{ placement: "left" }}>
//         <Popover.Trigger asChild>
//         <Button variant="solid" color="white" 
//         bg={useColorModeValue("#9AB3F2", '#335098')}
//         _hover={{bg : useColorModeValue("#8ba2dbff", '#3d5eb2ff')}}>File Extension</Button>
//         </Popover.Trigger>
//         <Popover.Positioner>
//         <Popover.Content>
//             <Popover.CloseTrigger />
//             <Popover.Arrow>
//             <Popover.ArrowTip />
//             </Popover.Arrow>
//             <Popover.Body p={3}>
            
//             <Stack color={props.iconTextColor}>
//                 {optionCheckboxes}
//             </Stack>

//             </Popover.Body>
//         </Popover.Content>
//         </Popover.Positioner>
//     </Popover.Root>);
// }

export default function FilterOptions(props : FilterOptionsProps){
    const [mediaTypes, setMediaTypes] = useState<string[]>([]);
    const handleMediaClick = (newMediaTypes : string[]) => {
        setMediaTypes(newMediaTypes);
        props.mediaTypeEvent(newMediaTypes);
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
                        options={[
                            {label : 'Image', value : 'image', toggle : false},
                            {label : 'Video', value : 'video', toggle : false},
                            {label : 'Audio', value : 'audio', toggle : false},
                        ]}
                    />

                    {/* <FileExtensionPopover iconTextColor={props.iconTextColor}  clickEvent={props.fileExtensionEvent}/> */}
                </Stack>

                </Popover.Body>
            </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    </>);
}
