import { Button } from "@chakra-ui/react";
import { useColorModeValue } from "../color-mode";
import { UpdateFileProps } from "./fileUpdate";
import { SubmitHandler, useForm } from "react-hook-form";
import { FileProp } from "./fileForm";

export default function DeleteFile (props: UpdateFileProps){
  const { setError } = useForm<FileProp>({
    defaultValues: {
      parent_folder: null,
      version: 1,
    }
  });
    
    const onSubmit: SubmitHandler<FileProp> = async (newFileData) =>{
        try{
            await props.submitEvent(newFileData);
            props.closeModal();
        } catch (err: any){
            if (err.response && err.response.data) {
                const backendErrors = err.response.data;

                Object.keys(backendErrors).forEach((field) => {
                const message = Array.isArray(backendErrors[field])
                    ? backendErrors[field][0]
                    : backendErrors[field];
                setError(field as keyof FileProp, { type: "server", message });
                });
            } else {
                // fallback error handling
                setError("root", { type: "server", message: "An unexpected error occurred." });
            }
        }
    }
    const newFileData: FileProp = {
        usage: "delete",
        id: props.filedata.id,
        filename: "",
        description: "",
        parent_folder: null,
        data: null,
        version: 1, 
    }

    return (
        <Button bg={useColorModeValue("#F29D9A", '#C04E4A')} w={'48%'} onClick={() => onSubmit(newFileData)}>
            Delete
        </Button>
    )
}