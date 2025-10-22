import {
  HStack, Text,
  Dialog, Heading,
  Portal, Spinner,
  CloseButton, Stack, Button
  } from "@chakra-ui/react";
import { useColorModeValue } from "../color-mode";
import { FaUser } from "react-icons/fa";
import React from "react";
import { User } from "./userForm";
import { useState } from "react";

interface DeleteConfirmationProps {
   user : User;
   deleteEvent : (userId : number) => void;
}

type DeleteConfirmationChildfulProps = React.PropsWithChildren<DeleteConfirmationProps>;

function DeleteConfirmation(props : DeleteConfirmationChildfulProps) {
    const iconTextColor = useColorModeValue("black", "white");
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [clickedDelete, setClickedDelete] = useState<boolean>(false);
    const deleteUser = () => {
        setClickedDelete(true);
        props.deleteEvent(props.user.id)
        setIsOpen(false);
    }

    return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(details)=>setIsOpen(details.open)}>
      <Dialog.Trigger asChild>
        {props.children}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner justifyContent="center" alignItems="center">
          <Dialog.Content w="25vw" minW="300px" p={4} maxH="70vh">

            <Dialog.Header mt={2}>
              <Dialog.Title 
                w="100%"
                color={iconTextColor}>
                <HStack w="100%" justify="center" mb={3}>
                  <FaUser />
                  <Heading fontFamily="var(--font-roboto-condensed)">Delete this user?</Heading>
                </HStack>
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body
            color={iconTextColor} w="100%">
                <Stack w="100%" align="center" px={2}>
                    <Text textAlign="center">
                        Are you sure you want to delete {props.user.first_name+"'s"} account? This will permanently delete this user.
                    </Text>
                    { !clickedDelete ?
                        <Button
                        color="red"
                        variant="ghost"
                        _hover={{bg : "gray.200"}}
                        p={3}
                        borderRadius={10}
                        onClick={deleteUser}
                        >Delete</Button>
                        :
                        <Spinner m={3}></Spinner>
                    }
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

export default DeleteConfirmation;
