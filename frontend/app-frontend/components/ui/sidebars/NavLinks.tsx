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
          borderRadius="lg"
          role="group"
          cursor="pointer"
          color={useColorModeValue('black', 'white')}
          _hover={{
            bg: 'cyan.400',
            color: 'white',
          }}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'black',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>A potential path</Collapsible.Content>
    </Collapsible.Root>
  )
}

export default NavItem