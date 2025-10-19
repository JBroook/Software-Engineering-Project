import React, { ReactNode, useState } from 'react'
import { Menu, Button, Portal, HStack, IconButton,
Text
} from "@chakra-ui/react"
import { LuArrowUpDown } from "react-icons/lu";
import { LuArrowDownUp } from "react-icons/lu";
import { useColorModeValue } from '../color-mode'

type option = {
    label : string;
    value : string;
}

type SortBarProps = {
    onChange : (value : string, order : string) => void;
    sortOptions : option[];
}

export default function SortBar(props: SortBarProps){
    const [value, setValue] = useState<string>("filename")
    const [toggle, setToggle] = useState<boolean>(false);
    let icon;
    if(toggle){
        icon = <LuArrowUpDown color={useColorModeValue("black", 'white')}/>
    }else{
        icon = <LuArrowDownUp color={useColorModeValue("black", 'white')}/>
    }
    const updateSortOptions = (newSortMethod : string, toggleValue : boolean) => {
        props.onChange(newSortMethod, toggleValue ? "asc" : "desc")
        setValue(newSortMethod);
        setToggle(toggleValue);
    }

    return (<>
        <HStack>
        <IconButton 
            _hover={{ bg: useColorModeValue("gray.300", '#585858ff') }}
            onClick={()=>updateSortOptions(value, !toggle)}>
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
                <Menu.Content p={2} minW="10rem">
                    <Menu.RadioItemGroup
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
                    >
                        {props.sortOptions.map((item) => (
                            <Menu.RadioItem 
                                key={item.value} 
                                value={item.value} 
                                p={2} 
                                onClick={()=>updateSortOptions(item.value, toggle)}
                                >
                                <Menu.ItemIndicator />
                                <Text ml={6}>{item.label}</Text>
                            </Menu.RadioItem>
                        ))}
                    </Menu.RadioItemGroup>
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
        </HStack>
    </>);
}