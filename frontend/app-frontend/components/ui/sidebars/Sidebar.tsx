'use client'

import React from 'react'
import { Box, Flex, Text, 
          Drawer,Portal, } from '@chakra-ui/react'
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { useColorModeValue } from '../color-mode'
import ToggleTheme from '../toggleTheme'
import NavItem from './NavLinks'

interface LinkItemProps {
  name: string
  icon: IconType
}

// List of navigation items
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome },
  { name: 'Trending', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Favourites', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
]

// Main Sidebar Component
export default function SimpleSidebar() {
  return (
    <>
    <Flex w={'20vw'}>
      <Drawer.Root 
      placement={"start"} 
      defaultOpen={true} 
      closeOnInteractOutside={false}
      >
        <Drawer.Positioner>
          <Drawer.Content w={{ base: '20vw'}}>
            <Drawer.Header>
              <Drawer.Title>
                  <Text 
                  fontSize="2xl" fontFamily={"Roboto"} fontWeight="extrabold" fontStyle={"italic"}>
                    DAM-N
                  </Text>
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Box
                bg={useColorModeValue('white', 'gray.900')}
                borderRight="1px"
                borderStyle={"solid"}
                borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                w={{ base: '20vw'}}
                pos="absolute"
                top={0}
                left={0}
                h="100vh">
                <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                  <Text fontSize="2xl" fontFamily={"Roboto"} fontWeight="extrabold" fontStyle={"italic"} color={useColorModeValue('blue.700', 'blue.400') }>
                    DAM-N
                  </Text>
                </Flex>
                <Flex h={"75vh"} overflowY={"auto"} direction="column" mt="4">
                  {LinkItems.map((link) => (
                    <NavItem key={link.name} icon={link.icon}>
                      {link.name}
                    </NavItem>
                  ))}
                </Flex>
                <Flex direction="column" mt="2">
                  <ToggleTheme />
                </Flex>
              </Box>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
      </Flex>
    </>
  )
}
