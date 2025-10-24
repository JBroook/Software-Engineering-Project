import React, { ReactNode } from 'react'
import { Input
} from "@chakra-ui/react"

type SearchbarProps = {
  placeholder: string;
  inputEvent: (keyword : string) => void;
  color : string;
}

export default function Searchbar(props: SearchbarProps){
    return (<Input 
        type="text"
        placeholder={props.placeholder}
        variant="flushed" 
        pl={2}
        color={props.color}
        _placeholder={{ color: props.placeholder}}
        data-state="open"
        onChange={(event) => props.inputEvent(event.target.value)}
        _open={{
            animationName: "fade-in, scale-in",
            animationDuration: "300ms",
    }}/>);
}