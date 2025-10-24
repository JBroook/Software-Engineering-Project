"use client"

import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, Spinner,
  HStack, Flex, Text,
  IconButton, Stack, Icon,
  Table, Button, SimpleGrid
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import SortableColumnHeader from "@/components/ui/user/sortableColumnHeader";
import { IoSearchCircleOutline } from "react-icons/io5";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { User } from "@/components/ui/user/userForm";
import DeleteConfirmation from "@/components/ui/user/deleteConfirmation";
import { HiUsers } from "react-icons/hi2";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { IoEye } from "react-icons/io5";
import { FaFile } from "react-icons/fa6";
import { GrStorage } from "react-icons/gr";
import { useRouter } from "next/navigation";
import TagForm, { TagType } from "@/components/ui/tags/tagForm";

type SFSParams = {
  searchKeyword : string;
  sortCriteria : string;
  sortOrder : string;
}

const defaultSFSParams : SFSParams = {
  searchKeyword : "",
  sortCriteria : "",
  sortOrder : "desc",
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



export default function TagsPage(){
  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
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

    const fetchTagTypes = async () =>{
      const res = await fetch("http://localhost:8000/api/tagtypes", {
        credentials : 'include',
        method : 'GET',
      });
      const data = await res.json();

      setTagTypes(data);
      // getOverviewData(data);
    }

    fetchTagTypes()
    
  }, []);

  type columnHeader = {
    label : string;
    value : string;
  }

  const columnHeaders : columnHeader[] = [
    { label : "Name", value : "name"},
    { label : "Tag Count", value : "tag_count"},
    { label : "Description", value : "description"},
  ]

  //search-filter-sort function
  const fetchSFS = async (SFS : SFSParams) => {
    const url = new URL('http://localhost:8000/api/tagtypes');
    if(SFS.searchKeyword!==""){
      url.searchParams.set('search', SFS.searchKeyword);
    }
    if(SFS.sortCriteria!==""){
      url.searchParams.set('sort_criteria', SFS.sortCriteria);
      url.searchParams.set('sort_order', SFS.sortOrder);
    }
    const res = await fetch(url.toString(), {
      credentials: 'include',
    });
    const data = await res.json();

    setTagTypes(data)
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

  // handle creating and updating users
  const createTagType = async (data : TagType) => {
    try{
      const res = await fetch('http://localhost:8000/api/tagtypes/', {
        credentials : 'include',
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),//give csrf token
        },
        body : JSON.stringify({
          "name" : data.name,
          "description" : data.description,
        })
      });

      if(res.ok){
        const userData = await res.json();
        const newUsers = [...tagTypes];
        newUsers.push(userData)
        setTagTypes(newUsers);
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
  const updateTagType = async (data : TagType) => {
    try{
      const res = await fetch(`http://localhost:8000/api/tagtypes/${data.id}/`, {
        credentials : 'include',
        method : 'PATCH',
        headers : {
          'Content-Type' : 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),// give csrf token
        },
        body : JSON.stringify({
          "name" : data.name,
          "description" : data.description
        })
      });

      if(res.ok){
        const tagTypeData = await res.json();
        const newTagTypes = [...tagTypes];
        const oldIndex = newTagTypes.findIndex(obj => obj.id === tagTypeData.id);
        if(oldIndex!==-1){
          newTagTypes[oldIndex] = tagTypeData
        }
        setTagTypes(newTagTypes);
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
  const deleteTagType = async (tagTypeId : number) => {
    const res = await fetch(`http://localhost:8000/api/tagtypes/${tagTypeId}/`, {
      credentials : 'include',
      method : 'DELETE',
      headers : {
        'Content-Type' : 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),// give csrf token
      }
    });

    if(res.ok){
      const newTagTypes = [...tagTypes];
      const removeId = newTagTypes.findIndex(tagType => tagType.id===tagTypeId)
      newTagTypes.splice(removeId, 1);
      setTagTypes(newTagTypes);
    }else{
      throw new Error('Failed to delete tag type');
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
            >Tags</Heading>
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
          <Searchbar color={iconTextColor} placeholder="Search tag types" inputEvent={searchKeyword}/>

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
          {tagTypes.map((item) => (
            <Table.Row key={item.id}  color={iconTextColor} bg="transparent">
              <Table.Cell py={2} pl={1}>{item.name} </Table.Cell>
              <Table.Cell>{item.tag_count}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>
                <HStack w="100%" justify="center">

                  <TagForm 
                  title="Edit Tag" 
                  tagType={item}
                  submitEvent={updateTagType}
                  >
                    <IconButton _hover={{color : "#4ceb34"}}>
                      <MdEdit />
                    </IconButton>
                  </TagForm>

                  <DeleteConfirmation
                  objectId={item.id}
                  objectName={"this tag ("+item.name+")"}
                  deleteEvent={deleteTagType}
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

    <TagForm title="Create New Tag" tagType={null} submitEvent={createTagType}> 
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
          <MdOutlineAddCircleOutline />
          Create Tag
      </Button>
    </TagForm>
    </>);
  }else{
    return (
    <Flex w="100%" h="100vh" justify="center" align="center">
    <Spinner color={iconTextColor}></Spinner>
    </Flex>);
  }
}
