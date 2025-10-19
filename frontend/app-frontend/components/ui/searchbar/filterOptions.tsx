import {
  Stack, IconButton,Popover, Checkbox,
  Menu, Button, Portal
} from "@chakra-ui/react"
import { IoFilter } from "react-icons/io5";
import { useColorModeValue } from "../color-mode";

interface FilterOptionsProps {
    iconTextColor : string;
    mediaTypeEvent : () => void;
    fileExtensionEvent : () => void;
}

interface PopoverOptionProps {
    clickEvent : (value : string) => void;
    iconTextColor : string;
}

function MediaTypePopover(props : PopoverOptionProps){
    const options = [
        'Image',
        'Video',
        'Document',
        'Audio',
        '3D Model'
    ];
    const optionCheckboxes = options.map( (option : string, index : number) => 
        <Checkbox.Root key={index} onClick={(e)=>props.clickEvent("Hello")}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label color={props.iconTextColor}>{option}</Checkbox.Label>
        </Checkbox.Root>
    );

    return (
    <Popover.Root positioning={{ placement: "left" }}>
        <Popover.Trigger asChild>
        <Button 
        variant="solid" 
        color="white" 
        bg={useColorModeValue("#9AB3F2", '#335098')}
        _hover={{bg : useColorModeValue("#8ba2dbff", '#3d5eb2ff')}}
        >Media Type</Button>
        </Popover.Trigger>
        <Popover.Positioner>
        <Popover.Content>
            <Popover.CloseTrigger />
            <Popover.Arrow>
            <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body p={3}>
            
            <Stack color={props.iconTextColor}>
                {optionCheckboxes}
            </Stack>

            </Popover.Body>
        </Popover.Content>
        </Popover.Positioner>
    </Popover.Root>);
}

function FileExtensionPopover(props : PopoverOptionProps){
    const options = [
        'jpg',
        'png',
        'webp',
        'gif',
        'mp4',
        'mp3'
    ];
    const optionCheckboxes = options.map( (option : string, index : number) => 
        <Checkbox.Root key={index}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label color={props.iconTextColor}>{option}</Checkbox.Label>
        </Checkbox.Root>
    );

    return (
    <Popover.Root positioning={{ placement: "left" }}>
        <Popover.Trigger asChild>
        <Button variant="solid" color="white" 
        bg={useColorModeValue("#9AB3F2", '#335098')}
        _hover={{bg : useColorModeValue("#8ba2dbff", '#3d5eb2ff')}}>File Extension</Button>
        </Popover.Trigger>
        <Popover.Positioner>
        <Popover.Content>
            <Popover.CloseTrigger />
            <Popover.Arrow>
            <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body p={3}>
            
            <Stack color={props.iconTextColor}>
                {optionCheckboxes}
            </Stack>

            </Popover.Body>
        </Popover.Content>
        </Popover.Positioner>
    </Popover.Root>);
}

export default function FilterOptions(props : FilterOptionsProps){
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
                    <MediaTypePopover iconTextColor={props.iconTextColor} clickEvent={props.mediaTypeEvent}/>

                    <FileExtensionPopover iconTextColor={props.iconTextColor}  clickEvent={props.fileExtensionEvent}/>
                </Stack>

                </Popover.Body>
            </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    </>);
}
