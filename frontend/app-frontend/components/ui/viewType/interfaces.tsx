import { clickEventProps, folderCRUD } from "../folder/folderCRUD";
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
  isAllowedEdit: boolean;
  id: number;
  parent_folder: number | null;
  filename: string;
  filetype: string;
  media: string;
  created_by: any;
  image: string;
  date: string;
  tags : FileTag[];
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

export interface EditFolder {
  id: number;
  foldername: string;
  parent_folder: number | null | undefined;
}

export type TagType = {
  id : number;
  name : string;
  tag_count : number;
  description : string;
}

type ParentFile = {
  id : number;
  parent_folder : number | null;
}

export type FileTag = {
  id : number;
  type : TagType;
  file : ParentFile;
}

export interface File {
  id: string;
  name: string;
  filetype: string;
  media_type: string;
  parent_folder: number | null;
  original_file: number;
  data: string;
  date_created: string;
  employee: any;
  tags : FileTag[];
}

export interface ViewProps {
  isAllowedEdit: boolean;
  folderId: number;
  folderName: string;
  folders : Folder[];
  files : File[];
  clickEvent : (data: clickEventProps) => void;
  submitEvent: (data : FileProp) => void;
  loading : boolean;
  sortFileEvent : (sortOption : string, sortOrder : string) => void;
  sortFolderEvent : (sortOption : string, sortOrder : string) => void;
}