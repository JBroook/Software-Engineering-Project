import {
  Button, HStack,
  Dialog, Heading,
  Portal, Field,
  Input, CloseButton, Stack,
  NativeSelect
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "../color-mode";
import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";
import { TiTag, TiTags } from "react-icons/ti";

export type TagType = {
  id : number;
  name : string;
  tag_count : number;
  description : string;
}

interface TagFormProps {
  title : string;
  tagType : TagType | null;
  submitEvent : (data : TagType) => void;
}

type TagFormChildfulProps = React.PropsWithChildren<TagFormProps>;

function TagForm(props : TagFormChildfulProps) {
  // const [formData, setFormData] = useState({ name: "", email: "" });
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const {register, handleSubmit, setError, formState: {errors}} = useForm<TagType>();

  const iconTextColor = useColorModeValue("black", "white");

  const onSubmit: SubmitHandler<TagType> = async (data) =>{
    const newTagTypeData = (props.tagType!==null) ? {...props.tagType} : data
    if (props.tagType!==null){// if existing tag is given, populate data with tag info
      Object.assign(newTagTypeData, data)
    }

    try{
      await props.submitEvent(newTagTypeData);
      setIsOpen(false);
    } catch (err: any){
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;

        Object.keys(backendErrors).forEach((field) => {
          const message = backendErrors[field][0]; // DRF returns list of messages
          setError(field as keyof TagType, {
            type: "server",
            message,
          });
        });
      } else {
        // fallback error handling
        setError("root", { type: "server", message: "An unexpected error occurred." });
      }
    }
  }

  type CrudField = {
    label : string;
    value : keyof TagType;
    requiredText : string;
  }
  const userCrudFields: CrudField[] = [
  { label : 'Tag Name', value : 'name', requiredText : "Tag name is required"},
  { label: 'Description', value: 'description', requiredText: 'Description is required' },
];

  const FieldComponents : React.JSX.Element[] = userCrudFields.map((field, index)=>{
    return (<Field.Root key={index} mb={4} invalid={!!errors[field.value]}>
      <Field.Label>
        {field.label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Input
        p={2}
        {...register(field.value, {required : field.requiredText})}
        defaultValue={props.tagType!==null? props.tagType[field.value] : undefined}
      />
      {/* <Field.HelperText /> */}
      <Field.ErrorText> 
        {errors[field.value]?.message}
      </Field.ErrorText>
    </Field.Root>);
  })

  const handleOpen = (details: { open: boolean | ((prevState: boolean) => boolean); }) => {
    setIsOpen(details.open)
  }

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={handleOpen}>
      <Dialog.Trigger asChild>
        {props.children}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner justifyContent="center" alignItems="center">
          <Dialog.Content w="25vw" minW="300px" p={4} maxH="70vh">

            <Dialog.Header mt={5}>
              <Dialog.Title 
                w="100%"
                color={iconTextColor}>
                <HStack w="100%" justify="center" mb={3}>
                  <TiTag />
                  <Heading fontFamily="var(--font-roboto-condensed)">{props.title}</Heading>
                </HStack>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
            color={iconTextColor} w="100%">
            <Stack w="90%" justifyContent="center" justifySelf="center">
              <form onSubmit={handleSubmit(onSubmit)}>
              {FieldComponents}

              <HStack w="100%" justify="center" mt={2} gap={5}>
                <Button type="submit" 
                bg={useColorModeValue("#9AB3F2", '#335098')} 
                _hover={{bg : "#8aa0d7ff"}}
                px={3}
                >
                  Confirm
                </Button>

                <Dialog.ActionTrigger asChild>
                  <Button 
                  bg={useColorModeValue("#9AB3F2", '#335098')} 
                  _hover={{bg : "#8aa0d7ff"}}
                  px={3}
                  >Cancel</Button>
                </Dialog.ActionTrigger>
              </HStack>
              </form>
            </Stack>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color={iconTextColor}/>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    </>
  );
}

export default TagForm;
