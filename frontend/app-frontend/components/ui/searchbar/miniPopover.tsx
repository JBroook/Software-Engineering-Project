import {
  Stack, IconButton,Popover, Checkbox,
  Menu, Button, Portal
} from "@chakra-ui/react"
import { useColorModeValue } from "../color-mode";
import { useState, useEffect } from "react";

type option = {
    label : string;
    value : string;
    toggle : boolean;
}

interface miniPopoverProps {
    clickEvent : (value : string[]) => void;
    iconTextColor : string;
    options : option[];
}

export default function MiniPopover(props : miniPopoverProps){
    const [options, setOptions] = useState<option[]>(props.options);

    const returnNewOptions = (index : number) => {
        const newOptions = [...options];
        newOptions[index].toggle = !newOptions[index].toggle;
        const filteredValues = newOptions
            .filter(option => option.toggle) // keep only those with toggle === true
            .map(option => option.value);
        props.clickEvent(filteredValues);
        setOptions(newOptions);
    }
    const optionCheckboxes = options.map( (option : option, index : number) => 
        <Checkbox.Root key={index} onChange={() => returnNewOptions(index)}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label color={props.iconTextColor}>{option.label}</Checkbox.Label>
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