import {
  Stack, IconButton,Popover, Checkbox,
  Menu, Button, Portal
} from "@chakra-ui/react"
import { IoFilter } from "react-icons/io5";
import { useColorModeValue } from "../color-mode";
import { useState } from "react";
import MiniPopover from "./miniPopover";


interface RoleFilterProps {
    iconTextColor : string;
    filterEvent : (newRoles : string[]) => void;
}


export default function RoleFilter(props : RoleFilterProps){
    const [roles, setRoles] = useState<string[]>([]);
    const clickEvent = (newRoles : string[]) => {
        setRoles(newRoles);
        props.filterEvent(newRoles);
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
                        clickEvent={clickEvent}
                        label="Media Type"
                        options={[
                            {label : 'Admin', value : 'admin'},
                            {label : 'Editor', value : 'editor'},
                            {label : 'Viewer', value : 'viewer'},
                        ]}
                    />
                </Stack>

                </Popover.Body>
            </Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    </>);
}
