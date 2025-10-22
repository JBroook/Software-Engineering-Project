export interface Folder {
  id: number;
  name: string;
  parent_folder: number | null;
  date_created: string;
  date_modified: string;
  subfolders: [];
}

export interface File {
  id: number;
  name: string;
  parent_folder: number | null;
  data: string;
  date_created: string;
  date_modified: string;
  size: number;
}

export interface ViewProps {
  folders : Folder[];
  files : File[];
  clickEvent : (folderId : number, folderName : string) => void;
  loading : boolean;
  sortFileEvent : (sortOption : string, sortOrder : string) => void;
  sortFolderEvent : (sortOption : string, sortOrder : string) => void;
}