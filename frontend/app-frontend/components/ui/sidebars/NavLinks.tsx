import { Box, Collapsible, Flex, FlexProps, Icon } from "@chakra-ui/react"
import { ReactNode } from "react"
import { IconType } from "react-icons"
import { useColorModeValue } from '../color-mode'

// Navigation Item
interface NavItemProps extends FlexProps {
  icon: IconType
  children: String | ReactNode
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Collapsible.Root
      as="a"
      // ref="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Collapsible.Trigger>
        <Flex
          align="center"
          p="4"
          mx="4"
          w={'full'}
          borderRadius="lg"
          role="group"
          cursor="pointer"
          color={useColorModeValue('black', 'white')}
          _hover={{
            bg: 'cyan.400',
            color: useColorModeValue('black', 'white'),
          }}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: useColorModeValue('black', 'white'),
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content color={useColorModeValue('black', 'white')}>
        <Flex mx={'16'} mb={'4'}>A potential path</Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default NavItem