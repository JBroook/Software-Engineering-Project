"use client"

import { Button } from "@chakra-ui/react"
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode"

const ToggleTheme = () => {
  const { toggleColorMode } = useColorMode()
  return (
    <Button
      variant="outline"
      onClick={toggleColorMode}
      color={useColorModeValue('black', 'white')}
      bg={useColorModeValue('white', 'gray.800')}
      m={4}
      p={2}
    >
      Toggle Mode
    </Button>
  )
}
export default ToggleTheme