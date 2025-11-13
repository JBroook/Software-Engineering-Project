import {  FlexProps, Icon, Link as ChakraLink, Button, Text } from "@chakra-ui/react"
import { ReactNode, useEffect, useState } from "react"
import { IconType } from "react-icons"
import { useColorModeValue } from '../color-mode'
import NextLink  from "next/link"

// Navigation Item
interface NavItemProps extends FlexProps {
  icon: IconType;
  href : string;
  name : string;
  iconTextColor : string;
}
const NavItem = ({ icon, href, name, iconTextColor, ...rest }: NavItemProps) => {
  return (
    <>
      <ChakraLink
      as={NextLink}
      href={href}
      >
        <Button
        width="85%"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        justifyContent={'flex-start'}
        color={iconTextColor}
        _hover={{
          bg: 'cyan.400',
          color: iconTextColor,
        }}>
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: iconTextColor,
          }}
          as={icon}
        />
        {name}
      </Button>
      </ChakraLink>
    </>
  )
}

export default NavItem