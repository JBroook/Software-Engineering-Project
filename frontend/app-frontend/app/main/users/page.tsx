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
import { useRouter } from "next/navigation";

type user = {
  id : number;
  firstName : string;
  lastName : string;
  username : string;
  email : string;
  role : string;
  joinDate : string;
  lastActive : string;
}

export default function UsersPage(){
  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');
  const users : user[] = [];

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
          <Table.ColumnHeader p={2}>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Username</Table.ColumnHeader>
          <Table.ColumnHeader>Email</Table.ColumnHeader>
          <Table.ColumnHeader>Role</Table.ColumnHeader>
          <Table.ColumnHeader>Join Date</Table.ColumnHeader>
          <Table.ColumnHeader>Last Active</Table.ColumnHeader>
          <Table.ColumnHeader>Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.firstName+" "+item.lastName}</Table.Cell>
            <Table.Cell>{item.username}</Table.Cell>
            <Table.Cell>{item.role}</Table.Cell>
            <Table.Cell>{item.joinDate}</Table.Cell>
            <Table.Cell>{item.lastActive}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
    </Box>
  </>);
}
