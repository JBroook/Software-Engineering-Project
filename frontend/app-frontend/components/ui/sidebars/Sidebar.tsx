'use client'

import React, { ReactNode } from 'react'
import { IconButton, Box, Button  , Flex, Icon, Text, Drawer, DrawerContent, useDisclosure, BoxProps, FlexProps, chakra, Collapsible, Portal, CloseButton } from '@chakra-ui/react'
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useColorModeValue } from '../color-mode'
import ToggleTheme from '../toggleTheme'
import NavItem from './NavLinks'
import { RxHamburgerMenu } from "react-icons/rx";

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
      <Drawer.Root placement={"left"}>
        <Drawer.Trigger asChild>
          <Button
            bg={useColorModeValue('white', 'gray.900')}
            border={"2px"}
            borderStyle={"solid"}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'auto' }}
            pos="absolute"
            top={{ base: '2.5vh'}}
            left={'2.5'}
            borderRadius={'8px'}
            h="auto">
            <Flex w='auto' h="40px" alignItems="center" mx="4" justifyContent="space-between">
              <RxHamburgerMenu color='black' />
              </Flex>
          </Button>
        </Drawer.Trigger>
        <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content size={'lg'}>
            <Drawer.Header>
              <Drawer.Title>
                  <Text fontSize="2xl" fontFamily={"Roboto"} fontWeight="extrabold" fontStyle={"italic"} color={useColorModeValue('blue.700', 'blue.400')}>
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
                w={{ base: 'full', md: 60 }}
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
            <Drawer.CloseTrigger asChild>
              <Button display={{ base: 'flex'}}>
                <MdKeyboardDoubleArrowLeft style={{ color: useColorModeValue('black', 'white') }}/>
              </Button>
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
      </Drawer.Root>
    </>
  )
}

// interface SidebarProps extends BoxProps {
//   onClose: () => void
// }

// // Sidebar content
// const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
//   const [open, setOpen] = React.useState(false);
//   const handleToggle = () => setOpen(!open);

//   return (
//   <Collapsible.Root unmountOnExit open={open}>
//     <Collapsible.Trigger paddingY="3">
//       <Box
//         bg={useColorModeValue('white', 'gray.900')}
//         border={"2px"}
//         borderStyle={"solid"}
//         borderColor={useColorModeValue('gray.200', 'gray.700')}
//         w={{ base: 'auto' }}
//         pos="absolute"
//         top={{ base: '2.5vh'}}
//         left={0}
//         borderRadius={'0 8px 8px 0'}
//         h="auto"
//         {...rest}
//         onClick={handleToggle}>
//         <Flex w='auto' h="40px" alignItems="center" mx="4" justifyContent="space-between">
//           <RxHamburgerMenu color='black' />
//           <Text ml={"4"} fontSize="2xl" fontFamily={"Roboto"} fontWeight="extrabold" fontStyle={"italic"} color={useColorModeValue('blue.700', 'blue.400') }>
//             DAM-N
//           </Text>
//           </Flex>
//       </Box>
//     </Collapsible.Trigger>
//     <Collapsible.Content>
//       <Box
//         bg={useColorModeValue('white', 'gray.900')}
//         borderRight="1px"
//         borderStyle={"solid"}
//         borderRightColor={useColorModeValue('gray.200', 'gray.700')}
//         w={{ base: 'full', md: 60 }}
//         pos="absolute"
//         top={0}
//         left={0}
//         h="100vh"
//         {...rest}>
//         <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" onClick={handleToggle}>
//           <Text fontSize="2xl" fontFamily={"Roboto"} fontWeight="extrabold" fontStyle={"italic"} color={useColorModeValue('blue.700', 'blue.400') }>
//             DAM-N
//           </Text>
//           <Button display={{ base: 'flex'}}>
//             <MdKeyboardDoubleArrowLeft style={{ color: useColorModeValue('black', 'white') }}/>
//           </Button>
//         </Flex>
//         <Flex h={"75vh"} overflowY={"auto"} direction="column" mt="4">
//           {LinkItems.map((link) => (
//             <NavItem key={link.name} icon={link.icon}>
//               {link.name}
//             </NavItem>
//           ))}
//         </Flex>
//         <Flex direction="column" mt="2">
//           <ToggleTheme />
//         </Flex>
//       </Box>
//     </Collapsible.Content>
//   </Collapsible.Root>
//   )
// }

// interface MobileProps extends FlexProps {
//   onOpen: () => void
// }
// const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
//   return (
//     <Flex
//       ml={{ base: 0, md: 60 }}
//       px={{ base: 4, md: 24 }}
//       height="20"
//       alignItems="center"
//       bg={useColorModeValue('white', 'gray.900')}
//       borderBottomWidth="1px"
//       borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
//       justifyContent="flex-start"
//       {...rest}>
//       <IconButton
//         variant="outline"
//         onClick={onOpen}
//         aria-label="open menu"
//         icon={<FiMenu />}
//       />

//       <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
//         Logo
//       </Text>
      
//     </Flex>
//   )
// }