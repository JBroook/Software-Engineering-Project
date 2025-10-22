import {
  Button, HStack,
  Dialog, Heading,
  Portal, Field,
  Input, CloseButton, Stack,
  NativeSelect
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "../color-mode";
import { FaUser } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";

type FormInput = {
  first_name : string;
  last_name : string;
  username : string;
  email : string;
  password : string;
  role : string;
}

function getCookie(name:string) {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return value ? decodeURIComponent(value.split('=')[1]) : "";
}

type User = {
  id : number;
  first_name : string;
  last_name : string;
  username : string;
  email : string;
  role : string;
  join_date : string;
  last_active : string;
}

interface UserFormProps {
  title : string;
  user : User | null;
}

type UserFormChildfulProps = React.PropsWithChildren<UserFormProps>;

function UserForm(props : UserFormChildfulProps) {
  // const [formData, setFormData] = useState({ name: "", email: "" });
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const {register, handleSubmit, formState: {errors}} = useForm<FormInput>();

  const iconTextColor = useColorModeValue("black", "white");

  const onSubmit: SubmitHandler<FormInput> = async (data) =>{
    console.log(data);
    const res = await fetch('http://localhost:8000/api/employees/', {
      credentials : 'include',
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body : JSON.stringify({
        "user" : {
          "username" : data.username,
          "email" : data.email,
          "first_name" : data.first_name,
          "last_name" : data.last_name,
          "password" : data.password
        },
        "role" : data.role
      })
    });

    if(res.ok){
      setIsOpen(false);
      const data = await res.json();

    }else{
      throw new Error('Failed to create employee');
    }

  }

  type UserCrudField = {
    label : string;
    value : keyof FormInput;
    requiredText : string;
  }
  const userCrudFields: UserCrudField[] = [
  { label : 'First Name', value : 'first_name', requiredText : "First Name is required"},
  { label: 'Last Name', value: 'last_name', requiredText: 'Last Name is required' },
  { label: 'Username', value: 'username', requiredText: 'Username is required' },
  { label: 'Email', value: 'email', requiredText: 'Email is required' },
];

  const FieldComponents : React.JSX.Element[] = userCrudFields.map((field, index)=>{
    return (<Field.Root key={index} mb={4}>
      <Field.Label>
        {field.label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Input 
        {...register(field.value, {required : field.requiredText})}
        // defaultValue={}
      />
      {/* <Field.HelperText /> */}
      {/* <Field.ErrorText> 
        {errors.firstName && <Text>This field is required</Text>}
      </Field.ErrorText> */}
    </Field.Root>);
  })

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(details)=>setIsOpen(details.open)}>
      <Dialog.Trigger asChild>
        {props.children}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner justifyContent="center" alignItems="center">
          <Dialog.Content w="25vw" minW="300px" p={4} maxH="70vh" overflowY="scroll">

            <Dialog.Header mt={5}>
              <Dialog.Title 
                w="100%"
                color={iconTextColor}>
                <HStack w="100%" justify="center" mb={3}>
                  <FaUser />
                  <Heading fontFamily="var(--font-roboto-condensed)">{props.title}</Heading>
                </HStack>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
            color={iconTextColor} w="100%">
            <Stack w="90%" justifyContent="center" justifySelf="center">
              <form onSubmit={handleSubmit(onSubmit)}>
              {FieldComponents}

              {!props.user &&
                <Field.Root mb={4}>
                  <Field.Label>
                    Password
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input type="password" {...register('password', {required : 'Password is required'})}/>
                  {/* <Field.HelperText /> */}
                  {/* <Field.ErrorText> 
                    {errors.firstName && <Text>This field is required</Text>}
                  </Field.ErrorText> */}
                </Field.Root>
              }

              <Field.Root mb={4}>
                <Field.Label>
                  Role
                  <Field.RequiredIndicator />
                </Field.Label>
                <NativeSelect.Root >
                  <NativeSelect.Field {...register('role', {required : 'Role is required'})} 
                    defaultValue={props.user ? props.user.role : undefined}>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
              <HStack w="100%" justify="center" mt={2} gap={10}>
                <Button type="submit">
                  Confirm
                </Button>

                <Dialog.ActionTrigger asChild>
                  <Button>Cancel</Button>
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

export default UserForm;
