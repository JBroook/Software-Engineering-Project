"use client"

import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, Spinner,
  HStack, Flex, Text,
  IconButton, Stack, Icon,
  Table, Button, SimpleGrid,
  ColorSwatch
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import SortableColumnHeader from "@/components/ui/user/sortableColumnHeader";
import { IoSearchCircleOutline } from "react-icons/io5";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { User } from "@/components/ui/user/userForm";
import DeleteConfirmation from "@/components/ui/user/deleteConfirmation";
import { FaHashtag } from "react-icons/fa";
import { IoMdPricetags } from "react-icons/io";
import { useRouter } from "next/navigation";
import TagForm, { TagType } from "@/components/ui/tags/tagForm";
import { Tooltip } from "@/components/ui/tooltip";
import { Toaster, toaster } from "@/components/ui/toaster"

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
  tags : number;
  types : number;
}


export default function TagsPage(){
  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');
  const [hasRoles, setHasRoles] = useState<boolean>(false);
  const [tagTypes, setTagTypes] = useState<TagType[]>([]);
  const [SFS, setSFS] = useState<SFSParams>(defaultSFSParams);
  const [overviewInfo, setOverviewInfo] = useState<OverviewInfo>({
    tags : 0,
    types : 0,
  });

  // calculate users function for overview
  const getOverviewData = async () => {
    const newOverviewInfo = {...overviewInfo};
    // storage related info
    const storageInfo = await fetch("http://localhost:8000/api/storage",{
      credentials : 'include',
      method : 'GET',
    });

    if(storageInfo.ok){
      const data = await storageInfo.json();
      newOverviewInfo.tags = data.tagCount;
      newOverviewInfo.types = data.tagTypes;
    }

    setOverviewInfo(newOverviewInfo);
    console.log(newOverviewInfo)
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
        if (user.role==='viewer'){
          router.push('/main')
        }else{
          setHasRoles(true);
        }
      }
    }

    onPageLoad()
    getOverviewData()

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
    { label : "Color", value : "color"},
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

  // handle creating tags
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
          "color" : data.color
        })
      });

      if(res.ok){
        const userData = await res.json();
        const newUsers = [...tagTypes];
        newUsers.push(userData)
        setTagTypes(newUsers);

        toaster.create({
          description: "Tag created",
          type: "info",
          closable: true,
        })
      }else{
        toaster.create({
          description: "Error creating tag",
          type: "info",
          closable: true,
        })
      }
    }catch (err:any){
      // handle DRF validation errors (400)
      if (err.response && err.response.status === 400) {
        // throw so form's catch block can use setError()
        throw err;
      }

      toaster.create({
        description: "Unexpected server error",
        type: "info",
        closable: true,
      })
    }
  }

  // update existing tag
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
          "description" : data.description,
          "color" : data.color
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

        toaster.create({
          description: "Tag updated",
          type: "info",
          closable: true,
        })
      }else{
        toaster.create({
          description: "Error updating tag",
          type: "info",
          closable: true,
        })
      }
    }catch (err:any){
      // handle DRF validation errors (400)
      if (err.response && err.response.status === 400) {
        // throw so form's catch block can use setError()
        throw err;
      }

      toaster.create({
        description: "Unexpected server error",
        type: "info",
        closable: true,
      })
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
      toaster.create({
        description: "Tag deleted",
        type: "info",
        closable: true,
      })
    }else{
      toaster.create({
        description: "Failed to delete tag",
        type: "info",
        closable: true,
      })
    }
  }

  // overview information
  const overviewBoxes = [
    { label: 'Types', value : overviewInfo.types, icon : IoMdPricetags},
    { label: 'Total Tags', value : overviewInfo.tags, icon : FaHashtag},
  ]
  const overviewBoxComponents = overviewBoxes.map((box, index)=>{
    return (
    <Stack 
    key={index} 
    borderRadius="100%" 
    bg={useColorModeValue("white", '#383838')} 
    aspectRatio="1/1" 
    width="100%" align="center" 
    justify="center">
      <Icon size={"2xl"} as={box.icon} color={useColorModeValue("#9AB3F2", '#335098')}/>
      <Heading color={iconTextColor} size="3xl">{box.value}</Heading>
      <Text color={iconTextColor} fontSize="sm">{box.label}</Text>
    </Stack>);
  });

  const upperPortionColor = useColorModeValue("#9AB3F2", '#335098');
  const lowerPortionColor = useColorModeValue("white", '#0D1835');

  if(hasRoles){
    return (<>
      <Toaster/>

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
              
        <HStack justifySelf="center" w="40%" pb={10}>
          <SimpleGrid columns={2} w="100%" gapY={3} gapX={4} color={iconTextColor}>
            {overviewBoxComponents}
          </SimpleGrid>
        </HStack>
      </Box>

      <Box minH="100vh" pt={5} bg={lowerPortionColor}>
        <HStack mr={8} w="250px" mb={3}  justifySelf="flex-end">
          <Tooltip content="Search">
            <IconButton borderRadius={"xl"} bg="#F6F6F6" cursor="pointer"
              _hover={{ bg: '#e0e0e0ff' }}>
                <IoSearchCircleOutline color="#9AB3F2" size={"sm"}/>
            </IconButton>
          </Tooltip>
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
                <HStack>
                  <ColorSwatch value={item.color} />
                  <Text>{item.color}</Text>
                </HStack>
                </Table.Cell>
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
                  title="Delete this tag?"
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
    <Spinner color={"gray"}></Spinner>
    </Flex>);
  }
}
