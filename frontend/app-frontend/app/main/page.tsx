'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Box, Heading,
  HStack, Flex, IconButton,
  Button, Text
} from "@chakra-ui/react"

// Icons
import { IoIosArrowBack } from "react-icons/io";
import { IoSearchCircleOutline } from "react-icons/io5";
import { RiGalleryView2 } from "react-icons/ri";
import { IoIosList } from "react-icons/io";

// UI Components
import Searchbar from "@/components/ui/searchbar/searchbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import GalleryView from "@/components/ui/viewType/galleryView";
import ListView from "@/components/ui/viewType/listView";
import { Folder, File, EditFolder } from "@/components/ui/viewType/interfaces";
import FilterOptions from "@/components/ui/searchbar/filterOptions";
import { TagType } from "@/components/ui/tags/tagForm";
import UserForm from "@/components/ui/user/userForm";
import FileForm, { FileProp, getFolderDetails } from "@/components/ui/item/fileForm";
import { AiFillFileAdd } from "react-icons/ai";
import { clickEventProps } from "@/components/ui/folder/folderCRUD";
import { Tooltip } from "@/components/ui/tooltip";
import { Toaster, toaster } from "@/components/ui/toaster"
import FolderTitle from "@/components/ui/folder/folderTitle";

function getCookie(name:string) {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return value ? decodeURIComponent(value.split('=')[1]) : "";
}

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
  console.log("Fetched file:",data)
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
  sortFileMethod : string;
  sortFileOrder : string;
  sortFolderMethod : string;
  sortFolderOrder : string;
  tagType : string[];
}

const defaultSFSParams : SFSParams = {
  searchKeyword : "",
  mediaType : [],
  fileExtension : [],
  sortFileMethod : "name",
  sortFileOrder : "asc",
  sortFolderMethod : "name",
  sortFolderOrder : "asc",
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

  const [currentFoldername, setCurrentFolderName] = useState<string>("All files");
  const [isAllowedEdit, setIsAllowedEdit] = useState<boolean>(false);
  const [searchbar, setSearchbar] = useState(true);
  const [viewType, setViewType] = useState("gallery");
  const [mounted, setMounted] = useState(false);

  //controls text and arrow color
  const iconTextColor = useColorModeValue("black", 'white');
  const buttonbg = useColorModeValue("#F6F6F6", '#0D1835');
  const fileFormColor = useColorModeValue("#9AB3F2", '#335098');
  const headerColor = useColorModeValue("#6082D6", '#0E1117');
  const [lastUpdated, setLastUpdated] = useState<number|null>(-1);
  
  // handle folder functions when clicked
  const handleFolder = (data:clickEventProps) => {
    if (data.usage == "rename") {
      updateFolder(data)
    } else if (data.usage == "delete") {
      deleteFolder(data)
    } else if (data.usage == "create"){
      createFolder(data)
    } else {
      if (data.folderId){
        openFolder(data.folderId, data.folderName)
      }
    }
  }

  // handles entering a folder when it is clicked
  const openFolder = async (newFolderId: number, newFolderName: string) => {
    let f = await getFolders(newFolderId);
    setFolders(f);

    f = await getFiles(newFolderId);
    setFiles(f);

    const fChain = [...folderChain, currentParent]
    setFolderChain(fChain);
    setCurrentParent(newFolderId);
    setCurrentFolderName(newFolderName);

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
    const lastFolderName = nChain.at(-1);
    setNameChain(nChain);
    console.log(lastFolderName)
    console.log(nChain)
    
    if(lastFolderName!==undefined){
      setCurrentFolderName(lastFolderName)
    }
  }

  // goes to any page instantly
  const goToFolder = async (chainIndex : number) => {
    const fChain = [...folderChain]
    const splitLength = fChain.length-chainIndex
    fChain.splice(chainIndex+1,splitLength);
    const folderId = fChain[chainIndex];

    console.log("Going to", folderId)

    if(folderId!==undefined){
      let f = await getFolders(folderId);
      setFolders(f);

      f = await getFiles(folderId);
      setFiles(f);

      setCurrentParent(folderId);
    }

    setFolderChain(fChain);
    const nChain = [...nameChain];
    nChain.splice(chainIndex+1,splitLength);
    console.log("hello", nChain)
    console.log("hello 2", fChain)
    setNameChain(nChain);
    if(nChain[chainIndex]!==undefined){
      setCurrentFolderName(nChain[chainIndex]);
    }
  }

  // check if user is logged in, else return to login page
  const router = useRouter();
  useEffect(()=>{
    const onPageLoad = async () => {
      // extra layer of protection in case the middleware doesn't catch unauthenticated users
      const res = await fetch('http://localhost:8000/api/user', { credentials: 'include' });
      if (!res.ok){
        router.push('/login')
      }else{
        const user = await res.json();
        console.log(user)
        if (user.role =='viewer'){
          router.push('/main')
        }else{
          setIsAllowedEdit(true);
        }
      }
    }

    onPageLoad()
    console.log("is allowed: ",isAllowedEdit)

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

    // set view type preference
    const viewTypePreference = getCookie("viewType");
    if(viewTypePreference!==""){
      setViewType(viewTypePreference)
    }

    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a simple loader
  }

  // sort function
  const sortFiles = (sortMethod : string, sortOrder : string) => {
    const newSFS = {...SFS};
    newSFS.sortFileMethod = sortMethod;
    newSFS.sortFileOrder = sortOrder;
    console.log(sortMethod)
    setSFS(newSFS)

    fetchSFS(newSFS)
  }

  const sortFolders = (sortMethod : string, sortOrder : string) => {
    const newSFS = {...SFS};
    newSFS.sortFolderMethod = sortMethod;
    newSFS.sortFolderOrder = sortOrder;
    console.log(sortMethod)
    setSFS(newSFS)

    fetchSFS(newSFS)
  }
  
  const handleFileCRUD = async (data: FileProp) => {
    if (data.usage == "create") {
      createFile(data)
    } else if (data.usage == "update") {
      updateFile(data)
    } else if (data.usage == 'delete') {
      deleteFile(data)
    }
  }

  const createFolder = async (data:clickEventProps) => {
    const folderData = new FormData();
    folderData.append('name', data.folderName);
    if (data.parent_folder != null){
      folderData.append('parent_folder', data.parent_folder.toString());
    }

    try{
      const res = await fetch(`http://localhost:8000/api/folders/`, {
        credentials : 'include',
        method : 'POST',
        headers : {
          'X-CSRFToken': getCookie('csrftoken'), //give csrf token
        },
        body : folderData,
      });

      if(res.ok){
        const folderData = await res.json();
        fetchSFS(SFS);

        toaster.create({
          description: "Folder created",
          type: "info",
          closable: true,
        })
      }else{
        const errorData = await res.json();
        console.log("error data:",errorData)
        const error = new Error('Validation failed');
        (error as any).response = {status: res.status, data:errorData}
        
        toaster.create({
          description: "Error creating folder",
          type: "info",
          closable: true,
        })
      }

    }catch (err:any){
      console.error('Error creating file:', err);
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
    };
  }

  const updateFolder = async (data:clickEventProps) => {
    const folderData = new FormData();
    if (data.folderId != null){
      folderData.append('id', data.folderId.toString());
    }
    folderData.append('name', data.folderName);
    if (data.parent_folder != null){
      folderData.append('parent_folder', data.parent_folder.toString());
    }

    try{
      const res = await fetch(`http://localhost:8000/api/folders/${data.folderId}/`, {
        credentials : 'include',
        method : 'PATCH',
        headers : {
          'X-CSRFToken': getCookie('csrftoken'), //give csrf token
        },
        body : folderData,
      });

      if(res.ok){
        const folderData = await res.json();
        fetchSFS(SFS);

        toaster.create({
          description: "Folder updated",
          type: "info",
          closable: true,
        })
      }else{
        const errorData = await res.json();
        console.log("error data:",errorData)
        const error = new Error('Validation failed');
        (error as any).response = {status: res.status, data:errorData}
        
        toaster.create({
          description: "Error updating file",
          type: "info",
          closable: true,
        })
      }

    }catch (err:any){
      console.error('Error creating file:', err);
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
    };
  }

  const deleteFolder = async (data : clickEventProps) => {
    try{
      const res = await fetch(`http://localhost:8000/api/folders/${data.folderId}/`, {
        credentials : 'include',
        method : 'DELETE',
        headers : {
          'Content-Type' : 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),// give csrf token
        }
      });

      if(res.ok){
        fetchSFS(SFS);

        toaster.create({
          description: "Folder deleted",
          type: "info",
          closable: true,
        })
      }else{
        toaster.create({
          description: "Failed to delete file",
          type: "info",
          closable: true,
        })
      }
    }catch (err:any){
      console.error('Error creating file:', err);
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

  // handle uploading files
  const createFile = async (data : FileProp) => {
    const fileProp: FileProp = {
      usage: "",
      id: data.id ?? 0,
      parent_folder: data.parent_folder || null,
      filename: data.filename,
      description: data.description,
      data: data.data,
      version: data.version,
      tags: []
    }

    const formData = new FormData();
    formData.append('file_id', '-1');
    if (fileProp.data){
      formData.append('data', fileProp.data);
    }
    formData.append('name', fileProp.filename);
    formData.append('description', fileProp.description);
    if (fileProp.parent_folder != null){
      formData.append('parent_folder', fileProp.parent_folder.toString());
    }
    formData.append('version', fileProp.version.toString());

    try{
      const res = await fetch(`http://localhost:8000/api/files/?parent_folder=${fileProp.parent_folder}`, {
        credentials : 'include',
        method : 'POST',
        headers : {
          'X-CSRFToken': getCookie('csrftoken'), //give csrf token
        },
        body : formData,
      });

      if(res.ok){
        const fileData = await res.json();
        fetchSFS(SFS);
        toaster.create({
          description: "File uploaded successfully",
          type: "info",
          closable: true,
        })
      }else{
        const errorData = await res.json();
        console.log("error data:",errorData)
        const error = new Error('Validation failed');
        (error as any).response = {status: res.status, data:errorData}
        toaster.create({
          description: "File failed to upload with error: "+errorData,
          type: "info",
          closable: true,
        })
      }

    }catch (err:any){
      console.error('Error creating file:', err);
      // handle DRF validation errors (400)
      if (err.response && err.response.status === 400) {
        // throw so form's catch block can use setError()
        toaster.create({
          description: "400 Bad request",
          type: "info",
          closable: true,
        })
      }
    };
  }

  const updateFile = async (data : FileProp) => {
    const fileProp: FileProp = {
      usage: "",
      id: data.id ?? 0,
      parent_folder: data.parent_folder || '',
      filename: data.filename,
      description: data.description,
      data: data.data,
      version: data.version,
      tags: data.tags
    }

    const formData = new FormData();
    if (fileProp.data){
      formData.append('data', fileProp.data);
    }
    formData.append('name', fileProp.filename);
    formData.append('file_id', fileProp.id != null ? String(fileProp.id) : '0');
    formData.append('description', fileProp.description);
    formData.append('parent_folder', fileProp.parent_folder || "");
    formData.append('version', fileProp.version.toString());
    formData.append('tags', JSON.stringify(fileProp.tags));

    try{
      const res = await fetch(`http://localhost:8000/api/files/?parent_folder=${fileProp.parent_folder}`, {
        credentials : 'include',
        method : 'POST',
        headers : {
          'X-CSRFToken': getCookie('csrftoken'), //give csrf token
        },
        body : formData,
      });

      if(res.ok){
        const fileData = await res.json();
        setLastUpdated(data.id);
        console.log("Updated prop: ", lastUpdated);
        fetchSFS(SFS);

        toaster.create({
          description: "File updated successfully",
          type: "info",
          closable: true,
        })
      }else{
        const errorData = await res.json();
        console.log("error data:",errorData)
        const error = new Error('Validation failed');
        (error as any).response = {status: res.status, data:errorData}
        toaster.create({
          description: "Error updating file",
          type: "info",
          closable: true,
        })
      }

    }catch (err:any){
      console.error('Error creating file:', err);
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
    };
  }

  const deleteFile = async (data : FileProp) => {
    try{
      const res = await fetch(`http://localhost:8000/api/files/${data.id}/`, {
        credentials : 'include',
        method : 'DELETE',
        headers : {
          'X-CSRFToken': getCookie('csrftoken'),// give csrf token
        }
      });

      if(res.ok){
        const newFile = [...files];
        
        const removeId = newFile.findIndex(file => file.original_file.toString()===data.id?.toString())
        console.log(newFile.splice(removeId, 1))
        newFile.splice(removeId, 1);
        setFiles(newFile);

        toaster.create({
          description: "File deleted",
          type: "info",
          closable: true,
        })
      }else{
        toaster.create({
          description: "Error deleting file",
          type: "info",
          closable: true,
        })
      }
    }catch (err:any){
      console.error('Error creating file:', err);
      // handle DRF validation errors (400)
      if (err.response && err.response.status === 400) {
        // throw so form's catch block can use setError()
        throw err
      }

      toaster.create({
        description: "Unexpected server error",
        type: "info",
        closable: true,
      })
    }
  }

  const handleReturnedLastUpdatedItem = () => {
    setLastUpdated(-1);
  }
  console.log(lastUpdated)
  
  const view = viewType=="gallery" ? (
      <GalleryView 
        isAllowedEdit={isAllowedEdit}
        folderId={currentParent}
        folderName={currentFoldername}
        folders={folders}
        files={files}
        clickEvent={handleFolder}
        submitEvent={handleFileCRUD}
        loading={loading}
        sortFileEvent={sortFiles}
        sortFolderEvent={sortFolders}
        lastUpdatedItem={lastUpdated}
        afterOpened={handleReturnedLastUpdatedItem}
      />
  ) : (
      <ListView 
        isAllowedEdit={isAllowedEdit}
        folderId={currentParent}
        folderName={currentFoldername}
        folders={folders} 
        files={files} 
        clickEvent={handleFolder}
        submitEvent={handleFileCRUD}
        loading={loading}
        sortFileEvent={sortFiles}
        sortFolderEvent={sortFolders}
        lastUpdatedItem={lastUpdated}
        afterOpened={handleReturnedLastUpdatedItem}
      />
  );

  const changeViewType = () => {
    const newViewType = viewType=="gallery"?"list" : "gallery";
    document.cookie = "viewType="+newViewType;
    setViewType(newViewType);
  }

  //search-filter-sort function
  const fetchSFS = async (SFS : SFSParams) => {
    // folders
    const url1 = new URL('http://localhost:8000/api/folders/');
    url1.searchParams.set('parent_folder', currentParent.toString());
    url1.searchParams.set('name', SFS.searchKeyword);
    url1.searchParams.set('sort_method', SFS.sortFolderMethod+"__"+SFS.sortFolderOrder);
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
    if(SFS.sortFileMethod!==""){
      url2.searchParams.set('sort_method', SFS.sortFileMethod+"__"+SFS.sortFileOrder);
    }
    const fileRes = await fetch(url2.toString(), {
      credentials: 'include',
    });
    const fileData = await fileRes.json();
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

  return (<>
    <Toaster/>

    <Box bg={fileFormColor} minH="100vh">
      {/* Header box for title, search bar and others */}
      <Flex 
      w="100%"
      h="12vh"
      justify="space-between"
      >
      
        <HStack
        ml={8}>
          {/* Remove back button if in root folder */}
          { (currentParent!==-1) &&
            <IconButton
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
            onClick={ascendFolderChain}>
              <IoIosArrowBack color={iconTextColor} size={"md"}/>
            </IconButton>
          }
          {/* file path title */}
          {nameChain.map((name, index)=>{
            return (<FolderTitle 
              key={index}
              title={name}
              inputEvent={()=>goToFolder(index)}
              iconTextColor={iconTextColor}
              last={index===nameChain.length-1}
            />)
          })}
        </HStack>

        <HStack mr={10}>
          <Tooltip content={"Search"}>
            <IconButton borderRadius={"xl"} bg={buttonbg} cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={() => setSearchbar(!searchbar)}>
              <IoSearchCircleOutline color="#9AB3F2" size={"sm"}/>
            </IconButton>
          </Tooltip>
            
            {searchbar && <Searchbar color={iconTextColor} placeholder="Search a file" inputEvent={searchKeyword}/>}

          
            <FilterOptions 
            iconTextColor={iconTextColor} 
            mediaTypeEvent={filterMediaType}
            fileExtensionEvent={filterFileExtension}
            tags={tagTypes}
            tagEvent={filterTags}
            />

          <Tooltip content={(viewType=="gallery"?"List":"Gallery")+" view"}>
            <IconButton borderRadius={"xl"} bg={buttonbg} cursor="pointer"
            _hover={{ bg: '#e0e0e0ff' }}
            onClick={changeViewType}>
              {viewType=="gallery"?<IoIosList color="#9AB3F2"/>:<RiGalleryView2 color="#9AB3F2"/>}
            </IconButton>
          </Tooltip>
          
          </HStack>
      </Flex>

      {view}

      {isAllowedEdit == true ? (
        <Flex 
        bg={fileFormColor} 
        position={'fixed'} 
        zIndex={2} right={'2vw'} bottom={'4vh'}
        >
          <FileForm 
          title="Upload File" 
          current_folder={currentParent.toString()}
          file={null} 
          folders={folders}
          submitEvent={createFile} />
        </Flex>
      ):(
        <></>
      )}
      
    </Box>
  </>);
}

