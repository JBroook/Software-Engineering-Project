'use client'

import React from 'react'
import { Box, Flex, Text, 
          Drawer,Portal, Button,
        Icon } from '@chakra-ui/react'
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu } from 'react-icons/fi'
import { RiLogoutBoxLine } from "react-icons/ri";
import { IconType } from 'react-icons'
import { useColorModeValue } from '../color-mode'
import ToggleTheme from '../toggleTheme'
import NavItem from './NavLinks'
import { useRouter } from 'next/navigation';
import { FaRegUser } from "react-icons/fa";
import { TiTags } from "react-icons/ti";


interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

// List of navigation items
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/main' },
  { name: 'Users', icon: FaRegUser, href: '/main/users' },
  { name: 'Tags', icon: TiTags, href: '/main/tags' },
]

function getCookie(name:string) {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return value ? decodeURIComponent(value.split('=')[1]) : "";
}

// Main Sidebar Component
export default function SimpleSidebar() {
  const titleText = useColorModeValue('blue.700', 'blue.400');
  const textColor = useColorModeValue('black', 'white');
  const basicbg = useColorModeValue('white', 'black');
  const contentbg = useColorModeValue('white', 'gray.900');
  const contentbg2 = useColorModeValue('#383838', '#D9D9D9');
  const border = useColorModeValue('gray.200', 'gray.700')
  const buttonbg = useColorModeValue("#79EB99", '#5BB975');
  const buttonbg2 = useColorModeValue("#9AB3F2", '#325ECB');

  // logout user logic
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('http://localhost:8000/api/logout/', {
      method: 'POST',
      credentials: 'include',
      headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
    });
    router.push('/login');
  };

  return (
    <>
    <Flex w={'20vw'} direction={'column'} position="fixed" top="0">
      <Box
        bg={contentbg}
        borderRight="1px"
        borderStyle={"solid"}
        borderRightColor={border}
        w={{ base: '20vw'}}
        pos="absolute"
        top={0}
        left={0}
        h="100vh">
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text 
          fontSize="2xl"
          fontFamily="var(--font-roboto-condensed)"
          color={titleText}>
            DAM-N
          </Text>
        </Flex>
        <Flex h={"75vh"} overflowY={"auto"} direction="column" mt="4">
          {LinkItems.map((link) => (
            <NavItem key={link.name} icon={link.icon} href={link.href}>
              {link.name}
            </NavItem>
          ))}

          {/* logout */}
          <Button
            // align="center"
            width="85%"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            justifyContent={'flex-start'}
            color={textColor}
            _hover={{
              bg: 'cyan.400',
              color: textColor,
            }}
            onClick={handleLogout}>
              <Icon
                mr="4"
                fontSize="16"
                _groupHover={{
                  color: textColor,
                }}
                as={RiLogoutBoxLine}
              /> Logout
          </Button>
        </Flex>
        <Flex direction="column" mt="2">
          <ToggleTheme />
        </Flex>
      </Box>
    </Flex>
    </>
  )
}
