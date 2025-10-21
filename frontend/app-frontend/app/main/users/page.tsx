"use client"

import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, Image, Grid,
  GridItem, HStack, Flex, SimpleGrid,
  Stack, IconButton, Input, Popover,
  Text, Table
} from "@chakra-ui/react"
import FilterOptions from "@/components/ui/searchbar/filterOptions";
import { useState, useEffect } from "react"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import SortableColumnHeader from "@/components/ui/user/sortableColumnHeader";

type user = {
  id : number;
  full_name : string;
  username : string;
  email : string;
  role : string;
  join_date : string;
  last_active : string;
}

export default function UsersPage(){
  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');
  const [users, setUsers] = useState<user[]>([]);
  const [sortOrder, setSortOrder] = useState<boolean>(false);

  useEffect(()=>{
    const fetchUsers = async () =>{
      const res = await fetch("http://localhost:8000/api/employees", {
        credentials : 'include',
        method : 'GET',
      });
      const data = await res.json()

      setUsers(data);
    }

    fetchUsers()
  }, []);

  type columnHeader = {
    label : string;
    value : string;
  }

  const columnHeaders : columnHeader[] = [
    { label : "Name", value : "name"},
    { label : "Username", value : "username"},
    { label : "Email", value : "email"},
    { label : "Role", value : "role"},
    { label : "Join Date", value : "join_date"},
    { label : "Last Active", value : "last_active"},
  ]

  const sortTable = async (sortCriteria : string) => {
    setSortOrder(!sortOrder)
    const url = new URL('http://localhost:8000/api/employees/');
    url.searchParams.set('sort_criteria', sortCriteria);
    url.searchParams.set('sort_order', sortOrder ? "desc" : "asc");
    const res = await fetch(url, {
      credentials : 'include',
      method : 'GET',
    });
    const data = await res.json()

    setUsers(data);
  }

  return (<>
    <Box bg={useColorModeValue("white", '#0D1835')} minH="100vh">
      {/* Header box for title, search bar and others */}
      <Flex 
      w="100%"
      h="12vh"
      justify="space-between"
      >
      
        <HStack
        ml={8}>
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color={iconTextColor}
          size={"3xl"}
          >Users</Heading>
        </HStack>

        <HStack mr={10}>
            {/* <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={() => setSearchbar(!searchbar)}>
              <IoSearchCircleOutline color="#9AB3F2" size={"sm"}/>
            </IconButton>
            
            {searchbar && <Searchbar placeholder="Search a file" inputEvent={searchKeyword}/>}

            <FilterOptions 
            iconTextColor={iconTextColor} 
            mediaTypeEvent={filterMediaType}
            fileExtensionEvent={filterFileExtension}
            />

            <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={changeViewType}>
              {viewType=="gallery"?<RiGalleryView2 color="#9AB3F2"/>:<IoIosList color="#9AB3F2"/>}
            </IconButton> */}

          </HStack>
      </Flex>

      <Table.Root ml={8} w="95%">
      <Table.Header>
        <Table.Row bg={useColorModeValue("#9AB3F2", '#335098')}>
          {columnHeaders.map((item, index)=>
            <SortableColumnHeader key={index} label={item.label} clickEvent={()=>sortTable(item.value)}/>
          )}
          <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((item) => (
          <Table.Row key={item.id}  color={iconTextColor}>
            <Table.Cell py={2}>{item.full_name} </Table.Cell>
            <Table.Cell>{item.username}</Table.Cell>
            <Table.Cell>{item.email}</Table.Cell>
            <Table.Cell>{item.role}</Table.Cell>
            <Table.Cell>{item.join_date}</Table.Cell>
            <Table.Cell>{item.last_active}</Table.Cell>
            <Table.Cell>
              <HStack w="100%" justify="center">
                <IconButton>
                  <MdEdit />
                </IconButton>
                <IconButton>
                  <MdDelete />
                </IconButton>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
    </Box>
  </>);
}
