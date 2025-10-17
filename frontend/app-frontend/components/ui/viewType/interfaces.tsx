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
  date_created: string;
  date_modified: string;
  size: number;
}
