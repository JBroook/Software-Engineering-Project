import {  FlexProps, Icon, Link as ChakraLink, Button } from "@chakra-ui/react"
import { ReactNode, useEffect, useState } from "react"
import { IconType } from "react-icons"
import { useColorModeValue } from '../color-mode'
import NextLink  from "next/link"

// Navigation Item
interface NavItemProps extends FlexProps {
  icon: IconType
  children: String | ReactNode,
  href : string;
}
const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  return (
    <>
    <ChakraLink w={'full'} href={href} _hover={{ textDecoration: 'none' }}>
      <Button
      align="center"
      width="85%"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      justifyContent={'flex-start'}
      color={useColorModeValue('black', 'white')}
      _hover={{
        bg: 'cyan.400',
        color: useColorModeValue('black', 'white'),
      }}
      {...rest}>
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: useColorModeValue('black', 'white'),
          }}
          as={icon}
        />
        {children}
      </Button>
    </ChakraLink>
    </>
  )
}

export default NavItem