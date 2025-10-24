'use client'
import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { 
  Box, Heading, Image, Grid,
  GridItem, HStack, Flex, SimpleGrid,
  Stack, IconButton, Input, Popover,
  Text, Checkbox
} from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";
import { IoSearchCircleOutline } from "react-icons/io5";
import { RiGalleryView2 } from "react-icons/ri";
import { IoIosList } from "react-icons/io";
import { useEffect, useState } from "react";
import GalleryView from "@/components/ui/viewType/galleryView";
import ListView from "@/components/ui/viewType/listView";
import { Folder, File } from "@/components/ui/viewType/interfaces";
import FilterOptions from "@/components/ui/searchbar/filterOptions";
import { useRouter } from "next/navigation";
import { TagType } from "@/components/ui/tags/tagForm";

const getFolders = async (parentFolder : number) => {
  const res = await fetch(`http://localhost:8000/api/folders/?parent_folder=${parentFolder}`, {
    credentials: 'include',
  });
  const data = await res.json();
  return data;
};

const getFiles = async (currentParent: number) => {
  const res = await fetch(`http://localhost:8000/api/files/?parent_folder=${currentParent}`, {
    credentials: 'include',
  });
  const data = await res.json();
  return data;
};

const getTags = async () => {
  const res = await fetch(`http://localhost:8000/api/tagtypes`, {
    credentials: 'include',
  });
  const data = await res.json();
  const filteredTagTypes = data.map((item : TagType)=>item.name)
  return filteredTagTypes;
};

type SFSParams = {
  searchKeyword : string;
  mediaType : string[];
  fileExtension : string[];
  sortMethod : string;
  sortOrder : string;
  tagType : string[];
}

const defaultSFSParams : SFSParams = {
  searchKeyword : "",
  mediaType : [],
  fileExtension : [],
  sortMethod : "",
  sortOrder : "asc",
  tagType : []
}

export default function Main() {
  const [loading, setLoading] = useState<boolean>(true);
  //folders and files are the actual array of items
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [tagTypes, setTagTypes] = useState<string[]>([]);

  const [currentParent, setCurrentParent] = useState<number>(-1);
  const [folderChain, setFolderChain] = useState<number[]>([]);
  const [nameChain, setNameChain] = useState<string[]>(["All files"]);
  // SFS=Search Filter Sort, controls the search filter sort params
  const [SFS, setSFS] = useState<SFSParams>(defaultSFSParams);

  // handles entering a folder when it is clicked
  const openFolder = async (newFolderId: number, newFolderName: string) => {
    let f = await getFolders(newFolderId);
    setFolders(f);

    f = await getFiles(newFolderId);
    setFiles(f);

    const fChain = [...folderChain, currentParent]
    setFolderChain(fChain);
    setCurrentParent(newFolderId);

    const nChain = [...nameChain, newFolderName]
    setNameChain(nChain);
  }

  // goes to previous folder if it exists
  const ascendFolderChain = async () => {
    const fChain = [...folderChain]
    const lastFolderId = fChain.pop();

    if(lastFolderId!==undefined){
      let f = await getFolders(lastFolderId);
      setFolders(f);

      f = await getFiles(lastFolderId);
      setFiles(f);

      setCurrentParent(lastFolderId);
    }
    setFolderChain(fChain);
    const nChain = [...nameChain];
    nChain.pop();
    setNameChain(nChain);
  }

  // check if user is logged in, else return to login page
  const router = useRouter();
  useEffect(()=>{
    // extra layer of protection in case the middleware doesn't catch unauthenticated users
    fetch('http://localhost:8000/api/user', { credentials: 'include' })
    .then(res => {
      if (!res.ok) {
        router.push('/login');
        return;
      }
    });

    // fetch current folder's child items, fetch items with no parents if at root folder
    const fetchAssets = async () =>{
      let f = await getFolders(currentParent);
      setFolders(f);

      f = await getFiles(currentParent);
      setFiles(f);

      // fetch all tag types
      f = await getTags();
      setTagTypes(f)

      setLoading(false);
    }

    fetchAssets()
  }, []);

  // sort function
  const sortFiles = (sortMethod : string, sortOrder : string) => {
    const newSFS = {...SFS};
    newSFS.sortMethod = sortMethod;
    newSFS.sortOrder = sortOrder;
    setSFS(newSFS)

    fetchSFS(newSFS)
  }

  // handles gallery vs list view
  const [searchbar, setSearchbar] = useState(true);
  const [viewType, setViewType] = useState("gallery");
  const view = viewType=="gallery" ? (
      <GalleryView 
        folders={folders} 
        files={files} 
        clickEvent={openFolder}
        loading={loading}
        sortFileEvent={sortFiles}
        sortFolderEvent={sortFiles}
      />
  ) : (
      <ListView 
        folders={folders} 
        files={files} 
        clickEvent={openFolder}
        loading={loading}
        sortFileEvent={sortFiles}
        sortFolderEvent={sortFiles}
      />
  );

  const changeViewType = () => {
    setViewType(viewType=="gallery"?"list" : "gallery" );
  }

  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');

  //search-filter-sort function
  const fetchSFS = async (SFS : SFSParams) => {
    // folders
    const url1 = new URL('http://localhost:8000/api/folders/');
    url1.searchParams.set('parent_folder', currentParent.toString());
    url1.searchParams.set('name', SFS.searchKeyword);
    if(SFS.sortMethod==='name' || SFS.sortMethod==='date_modified'){
      url1.searchParams.set('sort_method', SFS.sortMethod+"__"+SFS.sortOrder);
    }
    const folderRes = await fetch(url1, {
      credentials: 'include',
    });
    const folderData = await folderRes.json();
    setFolders(folderData)

    // files
    const url2 = new URL('http://localhost:8000/api/files/');
    url2.searchParams.set('parent_folder', currentParent.toString());

    // search
    if (SFS.searchKeyword.length>0){
      url2.searchParams.set('name', SFS.searchKeyword);
    }

    // filtering
    if (SFS.mediaType.length>0){
      url2.searchParams.set('media_type', SFS.mediaType.join("_"));
    }
    if (SFS.fileExtension.length>0){
      url2.searchParams.set('file_type', SFS.fileExtension.join("_"));
    }
    if (SFS.tagType.length>0){
      url2.searchParams.set('tag_type', SFS.tagType.join("_"));
    }

    // sort
    if(SFS.sortMethod!==""){
      url2.searchParams.set('sort_method', SFS.sortMethod+"__"+SFS.sortOrder);
    }
    const fileRes = await fetch(url2.toString(), {
      credentials: 'include',
    });
    const fileData = await fileRes.json();
    console.log(fileData)
    setFiles(fileData)
  }

  const searchKeyword = (keyword : string) => {
    const newSFS = {...SFS};
    newSFS.searchKeyword = keyword;
    setSFS(newSFS)

    fetchSFS(newSFS)
  }

  const filterMediaType = (mediaTypes : string[]) => {
    const newSFS = {...SFS};
    newSFS.mediaType = mediaTypes;
    setSFS(newSFS)

    fetchSFS(newSFS)
  }

  const filterFileExtension = (fileExtensions : string[]) => {
    const newSFS = {...SFS};
    newSFS.fileExtension = fileExtensions;
    setSFS(newSFS)

    fetchSFS(newSFS)
  }

  const filterTags = (tags : string[]) => {
    const newSFS = {...SFS};
    newSFS.tagType = tags;
    setSFS(newSFS)

    fetchSFS(newSFS)
  }

  return (
    <Box bg={useColorModeValue("#9AB3F2", '#335098')} minH="100vh">
      {/* Header box for title, search bar and others */}
      <Flex 
      w="100%"
      h="12vh"
      justify="space-between"
      >
      
        <HStack
        ml={8}>
          {/* Remove back button if in root folder */}
          { (currentParent!=-1) &&
            <IconButton
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={ascendFolderChain}>
              <IoIosArrowBack color={iconTextColor} size={"md"}/>
            </IconButton>
          }
          {/* file path title */}
          <Heading
          fontFamily="var(--font-roboto-condensed)"
          color={iconTextColor}
          size={"3xl"}
          >{nameChain.join(" / ")}</Heading>
        </HStack>

        <HStack mr={10}>
            <IconButton borderRadius={"xl"} bg={useColorModeValue("#F6F6F6", '#0D1835')} cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={() => setSearchbar(!searchbar)}>
              <IoSearchCircleOutline color="#9AB3F2" size={"sm"}/>
            </IconButton>
            
            {searchbar && <Searchbar color={iconTextColor} placeholder="Search a file" inputEvent={searchKeyword}/>}

            <FilterOptions 
            iconTextColor={iconTextColor} 
            mediaTypeEvent={filterMediaType}
            fileExtensionEvent={filterFileExtension}
            tags={tagTypes}
            tagEvent={filterTags}
            />

            <IconButton borderRadius={"xl"} bg={useColorModeValue("#F6F6F6", '#0D1835')} cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={changeViewType}>
              {viewType=="gallery"?<IoIosList color="#9AB3F2"/>:<RiGalleryView2 color="#9AB3F2"/>}
            </IconButton>

          </HStack>
      </Flex>

      {view}

    </Box>
  );
}

