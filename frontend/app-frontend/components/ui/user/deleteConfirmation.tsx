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
import React from "react";

interface DeleteConfirmationProps {
  title : string;
}

type DeleteConfirmationChildfulProps = React.PropsWithChildren<DeleteConfirmationProps>;

function DeleteConfirmation(props : DeleteConfirmationChildfulProps) {
    const iconTextColor = useColorModeValue("black", "white");

    return (
    <>
      <Dialog.Root>
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
