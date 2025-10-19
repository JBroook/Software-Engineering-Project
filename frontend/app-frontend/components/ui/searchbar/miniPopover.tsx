import {
  Stack, IconButton,Popover, Checkbox,
  Menu, Button, Portal
} from "@chakra-ui/react"
import { useColorModeValue } from "../color-mode";
import { useState, useEffect } from "react";
import { MdSelectAll } from "react-icons/md";
import { MdDeselect } from "react-icons/md";

type option = {
    label : string;
    value : string;
    toggle : boolean;
}

interface miniPopoverProps {
    clickEvent : (value : string[]) => void;
    iconTextColor : string;
    options : option[];
    label : string;
}

export default function MiniPopover(props : miniPopoverProps){
    const [options, setOptions] = useState<option[]>(props.options);
    const [canSelectAll, setCanSelectAll] = useState<boolean>(true);
    const [checkList, setCheckList] = useState<boolean[]>([]);

    useEffect(()=>{
        const newOptions = [...props.options];
        const filteredValues = newOptions
            .map(option => option.toggle);
        setCheckList(filteredValues);
    }, [])

    const returnNewOptions = (index : number) => {
        const newOptions = [...options];
        newOptions[index].toggle = !newOptions[index].toggle;
        const filteredValues = newOptions
            .filter(option => option.toggle) // keep only those with toggle === true
            .map(option => option.value);
        
        // if all options selected, disable canSelectAll
        setCanSelectAll(filteredValues.length!==options.length);

        props.clickEvent(filteredValues);
        setOptions(newOptions);
    }

    const selectAll = () => {
        const newOptions = [...options];
        newOptions.forEach(option => {
            option.toggle = canSelectAll ? false : true;
        });

        setCanSelectAll(!canSelectAll);
        setOptions(newOptions);
    }

    const optionCheckboxes = options.map( (option : option, index : number) => 
        <Checkbox.Root key={index}>
            <Checkbox.HiddenInput onChange={() => returnNewOptions(index)} checked/>
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
        >{props.label}</Button>
        </Popover.Trigger>
        <Popover.Positioner>
        <Popover.Content>
            <Popover.CloseTrigger />
            <Popover.Arrow>
            <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.Body p={3}>
            
            <Stack color={props.iconTextColor}>
                <Button 
                variant="outline"
                _hover={{bg : "#e4e4e4ff"}}
                onClick={selectAll}
                >
                    {canSelectAll ? (<><MdSelectAll /> Select All</>) : (<><MdDeselect />Deselect All</>)}
                </Button>
                {optionCheckboxes}
            </Stack>

            </Popover.Body>
        </Popover.Content>
        </Popover.Positioner>
    </Popover.Root>);
}