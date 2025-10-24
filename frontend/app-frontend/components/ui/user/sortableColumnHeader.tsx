import React from 'react'
import { HStack, Table, IconButton} from '@chakra-ui/react'
import { RiLogoutBoxLine } from "react-icons/ri";
import { IconType } from 'react-icons'
import { useColorModeValue } from '../color-mode'
import { FaSort } from "react-icons/fa";

type SortableColumnHeaderProps = {
  label : string;
  clickEvent : ()=>void;
}

export default function SortableColumnHeader(props : SortableColumnHeaderProps){
  return (<>
    <Table.ColumnHeader p={1}>
      <HStack justify="space-between">
        {props.label}
        <IconButton onClick={props.clickEvent}>
          <FaSort />
        </IconButton>
      </HStack>
    </Table.ColumnHeader>
  </>);
}