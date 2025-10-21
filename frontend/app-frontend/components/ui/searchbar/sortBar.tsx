import React, { ReactNode, useState } from 'react'
import { Menu, Button, Portal, HStack, IconButton
} from "@chakra-ui/react"
import { LuArrowUpDown } from "react-icons/lu";
import { LuArrowDownUp } from "react-icons/lu";
import { useColorModeValue } from '../color-mode'

export default function SortBar(){
    const [toggle, setToggle] = useState(false);
    let icon;
    if(toggle){
        icon = <LuArrowUpDown color={useColorModeValue("black", 'white')}/>
    }else{
        icon = <LuArrowDownUp color={useColorModeValue("black", 'white')}/>
    }

    return (<>
        <HStack>
        <IconButton 
            _hover={{ bg: useColorModeValue("gray.300", '#585858ff') }}
            onClick={()=>setToggle(!toggle)}>
            {icon}
        </IconButton>

        <Menu.Root >
            <Menu.Trigger asChild 
            mr={16}
            mb={3}
            mt={5}>
                <Button 
                variant="ghost" 
                size="sm" 
                color={useColorModeValue("black", 'white')}
                _hover={{ bg: useColorModeValue("gray.300", '#585858ff') }}
                p={2}>
                Sort by
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                <Menu.Content p={2}>
                    <Menu.Item value="filename" p={2}>Filename</Menu.Item>
                    <Menu.Item value="size" p={2}>Size</Menu.Item>
                    <Menu.Item value="date" p={2}>Date modified</Menu.Item>
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
        </HStack>
    </>);
}