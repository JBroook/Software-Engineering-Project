import React, { ReactNode } from 'react'
import { Input
} from "@chakra-ui/react"

interface SearchbarProps {
  placeholder: string;
  inputEvent: (keyword : string) => void;
}

export default function Searchbar(props: SearchbarProps){
    return (<Input 
        type="text"
        placeholder={props.placeholder}
        variant="flushed" 
        pl={2}
        color="white"
        _placeholder={{ color: "white"}}
        data-state="open"
        onChange={(event) => props.inputEvent(event.target.value)}
        _open={{
            animationName: "fade-in, scale-in",
            animationDuration: "300ms",
    }}/>);
}