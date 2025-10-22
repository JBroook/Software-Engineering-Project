"use client"

import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, 
  HStack, Flex, 
  IconButton, 
  Table, Button
} from "@chakra-ui/react"
import RoleFilter from "@/components/ui/searchbar/roleFilter";
import { useState, useEffect } from "react"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import SortableColumnHeader from "@/components/ui/user/sortableColumnHeader";
import { IoSearchCircleOutline } from "react-icons/io5";
import { IoPersonAdd } from "react-icons/io5";
import UserForm from "@/components/ui/user/userForm";
import { User } from "@/components/ui/user/userForm";

type SFSParams = {
  searchKeyword : string;
  sortCriteria : string;
  sortOrder : string;
  roleFilter : string[];
}

const defaultSFSParams : SFSParams = {
  searchKeyword : "",
  sortCriteria : "",
  sortOrder : "asc",
  roleFilter : []
}

function getCookie(name:string) {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return value ? decodeURIComponent(value.split('=')[1]) : "";
}

export default function UsersPage(){
  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');
  const [users, setUsers] = useState<User[]>([]);
  const [SFS, setSFS] = useState<SFSParams>(defaultSFSParams);

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

  //search-filter-sort function
  const fetchSFS = async (SFS : SFSParams) => {
    const url = new URL('http://localhost:8000/api/employees');
    if(SFS.searchKeyword!==""){
      url.searchParams.set('search', SFS.searchKeyword);
    }
    if(SFS.sortCriteria!==""){
      url.searchParams.set('sort_criteria', SFS.sortCriteria);
      url.searchParams.set('sort_order', SFS.sortOrder);
    }
    if(SFS.roleFilter.length>0){
      url.searchParams.set('roles', SFS.roleFilter.join('_'));
    }
    const res = await fetch(url.toString(), {
      credentials: 'include',
    });
    const data = await res.json();
    setUsers(data)
  }

  const sort = (sortCriteria : string) => {
    const newSFS = {...SFS};
    newSFS.sortCriteria = sortCriteria;
    newSFS.sortOrder = (newSFS.sortOrder==="asc") ? "desc" : "asc";
    setSFS(newSFS);
    fetchSFS(newSFS);
  }

  const searchKeyword = (keyword : string) => {
    const newSFS = {...SFS};
    newSFS.searchKeyword = keyword;
    setSFS(newSFS);
    fetchSFS(newSFS);
  }

  const filterRoles = (roles : string[]) => {
    const newSFS = {...SFS};
    newSFS.roleFilter = roles;
    setSFS(newSFS);
    fetchSFS(newSFS);
  }

  // handle creating and updating users
  const createUser = async (data : User) => {
    const res = await fetch('http://localhost:8000/api/employees/', {
      credentials : 'include',
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),//give csrf token
      },
      body : JSON.stringify({
        "user" : {
          "username" : data.username,
          "email" : data.email,
          "first_name" : data.first_name,
          "last_name" : data.last_name,
          "password" : data.password
        },
        "role" : data.role
      })
    });

    if(res.ok){
      const data = await res.json();
      const newUsers = [...users];
      newUsers.push(data)
      setUsers(newUsers);
    }else{
      throw new Error('Failed to create employee');
    }
  }

  // update existing user
  const updateUser = async (data : User) => {
    const res = await fetch(`http://localhost:8000/api/employees/${data.id}/`, {
      credentials : 'include',
      method : 'PATCH',
      headers : {
        'Content-Type' : 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),// give csrf token
      },
      body : JSON.stringify({
        "user" : {
          "username" : data.username,
          "email" : data.email,
          "first_name" : data.first_name,
          "last_name" : data.last_name,
        },
        "role" : data.role
      })
    });

    if(res.ok){
      const data = await res.json();
      const newUsers = [...users];
      const oldIndex = newUsers.findIndex(obj => obj.id === data.id);
      if(oldIndex!==-1){
        newUsers[oldIndex] = data
      }
      setUsers(newUsers);
    }else{
      throw new Error('Failed to create employee');
    }
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

      <HStack ml={8} w="250px" mb={3} >
        <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
          _hover={{ bg: '#e0e0e0ff' }}>
            <IoSearchCircleOutline color="#9AB3F2" size={"sm"}/>
        </IconButton>
        <Searchbar color={iconTextColor} placeholder="Search users" inputEvent={searchKeyword}/>

        <RoleFilter 
          iconTextColor={iconTextColor} 
          filterEvent={filterRoles}
        />
      </HStack>


      <Table.Root ml={8} w="95%">
      <Table.Header>
        <Table.Row bg={useColorModeValue("#9AB3F2", '#335098')}>
          {columnHeaders.map((item, index)=>
            <SortableColumnHeader key={index} label={item.label} clickEvent={()=>sort(item.value)}/>
          )}
          <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((item) => (
          <Table.Row key={item.id}  color={iconTextColor}>
            <Table.Cell py={2} pl={1}>{item.first_name+" "+item.last_name} </Table.Cell>
            <Table.Cell>{item.username}</Table.Cell>
            <Table.Cell>{item.email}</Table.Cell>
            <Table.Cell>{item.role}</Table.Cell>
            <Table.Cell>{item.join_date}</Table.Cell>
            <Table.Cell>{item.last_active}</Table.Cell>
            <Table.Cell>
              <HStack w="100%" justify="center">

                <UserForm 
                title="Edit User" 
                user={item}
                submitEvent={updateUser}
                >
                  <IconButton>
                    <MdEdit />
                  </IconButton>
                </UserForm>

                <IconButton>
                  <MdDelete />
                </IconButton>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>

    <UserForm title="Create New User" user={null} submitEvent={createUser}> 
      <Button
        color={iconTextColor}
        variant="ghost" 
        size="sm"
        position="fixed"
        bottom="30px"
        right="30px"
        p={2}
        bg={useColorModeValue("#9AB3F1", "#335098")}
        _hover={{bg : "#8fa5ddff"}}
        >
          <IoPersonAdd />
          Create User
      </Button>
    </UserForm>
    </Box>
  </>);
}
