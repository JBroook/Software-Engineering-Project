"use client"

import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, Spinner,
  HStack, Flex, Text,
  IconButton, Stack, Icon,
  Table, Button, SimpleGrid
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
import DeleteConfirmation from "@/components/ui/user/deleteConfirmation";
import { HiUsers } from "react-icons/hi2";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { IoEye } from "react-icons/io5";
import { FaFile } from "react-icons/fa6";
import { GrStorage } from "react-icons/gr";
import { useRouter } from "next/navigation";

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

type OverviewInfo = {
  totalUsers : number;
  admins : number;
  editors : number;
  viewers : number;
  files : number;
  storage : number;
}

function convertISOTime(data : User[]){
  if(data.length>0){
    data.forEach((user : User)=>{
      const joinDate = new Date(user.join_date);
      const lastActive = new Date(user.last_active);
      user.join_date = joinDate.toLocaleDateString();
      user.last_active = lastActive.toLocaleString();
    })
  }
}

export default function UsersPage(){
  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [SFS, setSFS] = useState<SFSParams>(defaultSFSParams);
  const [overviewInfo, setOverviewInfo] = useState<OverviewInfo>({
    totalUsers : 0,
    admins : 0,
    editors : 0,
    viewers : 0,
    files : 0,
    storage : 0
  });

  // calculate users function for overview
  const getOverviewData = async (users : User[]) => {
    if(users.length>0){

      // user related info
      const admins = users.filter((user)=>user.role==="admin").length
      const editors = users.filter((user)=>user.role==="editor").length
      const viewers = users.filter((user)=>user.role==="viewer").length

      const newOverviewInfo = {...overviewInfo};
      newOverviewInfo.admins = admins;
      newOverviewInfo.editors = editors;
      newOverviewInfo.viewers = viewers;
      newOverviewInfo.totalUsers = admins+editors+viewers;

      // storage related info
      const storageInfo = await fetch("http://localhost:8000/api/storage",{
        credentials : 'include',
        method : 'GET',
      });

      if(storageInfo.ok){
        const data = await storageInfo.json();
        newOverviewInfo.files = data.fileNumber;
        newOverviewInfo.storage = data.storageSize;
      }

      setOverviewInfo(newOverviewInfo);
    }
  }

  const router = useRouter();
  useEffect(()=>{
    const onPageLoad = async () => {
      // extra layer of protection in case the middleware doesn't catch unauthenticated users
      const res = await fetch('http://localhost:8000/api/user', { credentials: 'include' });
      if (!res.ok){
        router.push('/login')
      }else{
        const user = await res.json();
        if (user.role!=='admin'){
          router.push('/main')
        }else{
          setIsAdmin(true);
        }
      }
    }

    onPageLoad()

    const fetchUsers = async () =>{
      const res = await fetch("http://localhost:8000/api/employees", {
        credentials : 'include',
        method : 'GET',
      });
      const data = await res.json();

      convertISOTime(data);

      setUsers(data);
      getOverviewData(data);
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

    convertISOTime(data);

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
    try{
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
        const userData = await res.json();
        const newUsers = [...users];
        newUsers.push(userData)
        setUsers(newUsers);
      }else{
        const errorData = await res.json();
        const error = new Error('Validation failed');
        (error as any).response = {status: res.status, data:errorData}
        throw error;
      }
    }catch (err:any){
      // handle DRF validation errors (400)
      if (err.response && err.response.status === 400) {
        // throw so form's catch block can use setError()
        throw err;
      }

      throw new Error('Unexpected server error');
    }
  }

  // update existing user
  const updateUser = async (data : User) => {
    try{
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
        const userData = await res.json();
        const newUsers = [...users];
        const oldIndex = newUsers.findIndex(obj => obj.id === userData.id);
        if(oldIndex!==-1){
          newUsers[oldIndex] = userData
        }
        setUsers(newUsers);
      }else{
        const errorData = await res.json();
        const error = new Error('Validation failed');
        (error as any).response = {status: res.status, data:errorData}
        throw error;
      }
    }catch (err:any){
      // handle DRF validation errors (400)
      if (err.response && err.response.status === 400) {
        // throw so form's catch block can use setError()
        throw err;
      }

      throw new Error('Unexpected server error');
    }
  }

  // delete user
  const deleteUser = async (userId : number) => {
    const res = await fetch(`http://localhost:8000/api/employees/${userId}/`, {
      credentials : 'include',
      method : 'DELETE',
      headers : {
        'Content-Type' : 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),// give csrf token
      }
    });

    if(res.ok){
      const newUsers = [...users];
      const removeId = newUsers.findIndex(user => user.id===userId)
      newUsers.splice(removeId, 1);
      setUsers(newUsers);
    }else{
      throw new Error('Failed to delete employee');
    }
  }

  // overview information
  const overviewBoxes = [
    { label: 'Total Users', value : overviewInfo.admins+overviewInfo.editors+overviewInfo.viewers, icon : HiUsers},
    { label: 'Admins', value : overviewInfo.admins, icon : HiMiniWrenchScrewdriver},
    { label: 'Files', value : overviewInfo.files, icon : FaFile},
    { label: 'Editors', value : overviewInfo.editors, icon : MdEdit},
    { label: 'Viewers', value : overviewInfo.viewers, icon : IoEye},
    { label: 'Storage', value : overviewInfo.storage, icon : GrStorage},
  ]
  const overviewBoxComponents = overviewBoxes.map((box, index)=>{
    return (
    <Stack 
    key={index} 
    borderRadius={10} 
    bg={useColorModeValue("white", '#383838')} 
    aspectRatio="4/3" 
    width="100%" align="center" 
    justify="center">
      <Icon size={"2xl"} as={box.icon} color={useColorModeValue("#9AB3F2", '#335098')}/>
      <Heading color={iconTextColor} size="3xl">{box.value}</Heading>
      <Text color={iconTextColor} fontSize="sm">{box.label}</Text>
    </Stack>);
  });

  const upperPortionColor = useColorModeValue("#9AB3F2", '#335098');
  const lowerPortionColor = useColorModeValue("white", '#0D1835');

  if(isAdmin){
    return (<>
      <Box bg={upperPortionColor} w="100%">
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
              
        <HStack justifySelf="center" w="60%" pb={10}>
          <SimpleGrid columns={3} w="100%" gapY={3} gapX={4} color={iconTextColor}>
            {overviewBoxComponents}
          </SimpleGrid>
        </HStack>
      </Box>

      <Box minH="100vh" pt={5} bg={lowerPortionColor}>
        <HStack mr={8} w="250px" mb={3}  justifySelf="flex-end">
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

        <Table.Root ml={8} w="95%" borderTopRadius={10} overflow="hidden">
        <Table.Header>
          <Table.Row bg={upperPortionColor}>
            {columnHeaders.map((item, index)=>
              <SortableColumnHeader key={index} label={item.label} clickEvent={()=>sort(item.value)}/>
            )}
            <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((item) => (
            <Table.Row key={item.id}  color={iconTextColor} bg="transparent">
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
                    <IconButton _hover={{color : "#4ceb34"}}>
                      <MdEdit />
                    </IconButton>
                  </UserForm>

                  <DeleteConfirmation
                  objectId={item.id}
                  objectName={item.first_name+"s account"}
                  deleteEvent={deleteUser}
                  >
                    <IconButton _hover={{color : "red"}}>
                      <MdDelete />
                    </IconButton>
                  </DeleteConfirmation>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>

    <UserForm title="Create New User" user={null} submitEvent={createUser} key={1 }> 
      <Button
        color={iconTextColor}
        variant="ghost" 
        size="sm"
        position="fixed"
        bottom="30px"
        right="30px"
        p={2}
        bg={upperPortionColor}
        _hover={{bg : "#8fa5ddff"}}
        boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
        >
          <IoPersonAdd />
          Create User
      </Button>
    </UserForm>
    </>);
  }else{
    return (
    <Flex w="100%" h="100vh" justify="center" align="center">
    <Spinner color={"gray"}></Spinner>
    </Flex>);
  }
}
