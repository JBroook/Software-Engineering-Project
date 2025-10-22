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

export type User = {
  id : number;
  first_name : string;
  last_name : string;
  username : string;
  email : string;
  role : string;
  join_date : string;
  last_active : string;
  password : string;
}

interface UserFormProps {
  title : string;
  user : User | null;
  submitEvent : (data : User) => void;
}

type UserFormChildfulProps = React.PropsWithChildren<UserFormProps>;

function UserForm(props : UserFormChildfulProps) {
  // const [formData, setFormData] = useState({ name: "", email: "" });
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const {register, handleSubmit, formState: {errors}} = useForm<User>();

  const iconTextColor = useColorModeValue("black", "white");

  const onSubmit: SubmitHandler<User> = (data) =>{
    const newUserData = {...props.user}
    if(props.user!==null){// if exisitng user is given, populate data with user info
      Object.assign(newUserData, data)
    }

    console.log(newUserData);
    props.submitEvent(newUserData);
    setIsOpen(false);
  }

  type UserCrudField = {
    label : string;
    value : keyof User;
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
        p={2}
        {...register(field.value, {required : field.requiredText})}
        defaultValue={props.user!==null? props.user[field.value] : undefined}
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
                  <Input p={2} type="password" {...register('password', {required : 'Password is required'})}/>
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
                  <NativeSelect.Field p={2} {...register('role', {required : 'Role is required'})} 
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
