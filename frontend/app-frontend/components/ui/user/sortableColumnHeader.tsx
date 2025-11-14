import React from 'react'
import { HStack, Table, IconButton} from '@chakra-ui/react'
import { FaSort } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip";

type SortableColumnHeaderProps = {
  label : string;
  clickEvent : ()=>void;
}

export default function SortableColumnHeader(props : SortableColumnHeaderProps){
  return (<>
    <Table.ColumnHeader p={1}>
      <HStack justify="space-between">
        {props.label}
        <Tooltip content="Sort">
          <IconButton onClick={props.clickEvent}>
            <FaSort />
          </IconButton>
        </Tooltip>
      </HStack>
    </Table.ColumnHeader>
  </>);
}