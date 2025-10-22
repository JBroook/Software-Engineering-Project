import {
  Button, HStack,
  Dialog, Heading,
  Portal, Field,
  Input, CloseButton, Stack,
  NativeSelect
} from "@chakra-ui/react";
import { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { useColorModeValue } from "../color-mode";
import { FaUser } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";

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

function CrudModal() {
  // const [formData, setFormData] = useState({ name: "", email: "" });

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
      return res.json();
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
      <Input {...register(field.value, {required : field.requiredText})}/>
      {/* <Field.HelperText /> */}
      {/* <Field.ErrorText> 
        {errors.firstName && <Text>This field is required</Text>}
      </Field.ErrorText> */}
    </Field.Root>);
  })

  return (
    <>
      <Dialog.Root >
      <Dialog.Trigger asChild>
        <Button
        color={iconTextColor}
        variant="ghost" 
        size="sm"
        position="fixed"
        bottom="30px"
        right="30px"
        p={2}
        bg={useColorModeValue("#9AB3F1", "#335098")}
        _hover={{bg : "#8fa5ddff"}}
        >
          <IoPersonAdd />
          Create User
        </Button>
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
                  <Heading fontFamily="var(--font-roboto-condensed)">Create New User</Heading>
                </HStack>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
            color={iconTextColor} w="100%">
            <Stack w="90%" justifyContent="center" justifySelf="center">
              <form onSubmit={handleSubmit(onSubmit)}>
              {FieldComponents}

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

              <Field.Root mb={4}>
                <Field.Label>
                  Role
                  <Field.RequiredIndicator />
                </Field.Label>
                <NativeSelect.Root >
                  <NativeSelect.Field {...register('role', {required : 'Role is required'})}>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin ">Admin</option>
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

export default CrudModal;
