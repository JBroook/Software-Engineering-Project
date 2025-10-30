import { FileProp } from "../item/fileForm";

export interface Employee{
  username: string;
}

export interface Version {
  version: number;
  name: string;
  description: string;
  filetype: string;
  size: number;
  date_created: string;
  created_by: string;
  data: File;
  employee: any;
}

export interface ViewItemProps {
  id: number;
  parent_folder: number | null;
  filename: string;
  filetype: string;
  created_by: any;
  image: string;
  date: string;
  submitEvent: (data : FileProp) => void;
}

export interface Folder {
  id: number;
  name: string;
  parent_folder: number | null;
  date_created: string;
  date_modified: string;
  subfolders: [];
}

export interface File {
  id: string;
  name: string;
  filetype: string;
  parent_folder: number | null;
  original_file: number;
  data: string;
  date_created: string;
  employee: any;
}

export interface ViewProps {
  folders : Folder[];
  files : File[];
  clickEvent : (folderId : number, folderName : string) => void;
  submitEvent: (data : FileProp) => void;
  loading : boolean;
  sortFileEvent : (sortOption : string, sortOrder : string) => void;
  sortFolderEvent : (sortOption : string, sortOrder : string) => void;
}