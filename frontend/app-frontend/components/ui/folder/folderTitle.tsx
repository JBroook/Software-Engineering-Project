import React, { useEffect, useState } from 'react'
import { Box, Flex, Input, Stack, Heading
} from '@chakra-ui/react'

type FolderTitleProps = {
  title : string;
  iconTextColor : string;
  inputEvent : ()=>void;
  last : boolean;
}

export default function FolderTitle(props : FolderTitleProps) {

  return (<>
    <Heading
      fontFamily="var(--font-roboto-condensed)"
      color={props.iconTextColor}
      size={"3xl"}
      cursor="pointer"
      onClick={props.inputEvent}
      >{props.title} {!props.last && "/"} </Heading>
  </>);
}