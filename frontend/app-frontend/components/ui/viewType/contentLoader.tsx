import React, { ReactNode } from 'react'
import { Flex, Spinner, Text
} from '@chakra-ui/react'
import {Folder, File} from './interfaces'

interface ContentLoaderProps {
    loading : boolean;
    color : string;
    content : React.JSX.Element[];
}

export default function ContentLoader(props : ContentLoaderProps) {
    if(props.loading){
        return <Flex justify="center" w="100%"><Spinner color={props.color}/></Flex>;
    }else if(props.content.length>0){
        return <>{props.content}</>;
    }else{
        return <Flex justify="center" w="100%"><Text color={props.color}>No content found.</Text></Flex>;
    }
}