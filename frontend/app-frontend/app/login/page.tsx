import { 
  AbsoluteCenter, 
  Box, 
  Container, 
  Heading, 
  Field, 
  Input, 
  Stack,
  Button
} from "@chakra-ui/react"

export default function LoginPage(){
    return (<><Container h="100vh" overflow="hidden">
      <Heading color={"#002992"}>DAM-N</Heading>

      <Box
        bg="#9ac6f27f"
        w={400}
        h={400}
        position="absolute"
        top="26px"
        left="750px"
        zIndex={0}
        />
      <Box
        bg="#9aa7f281"
        w={400}
        h={400}
        position="absolute"
        top="273px"
        left="450px"
        zIndex={0}
        />
      <Box
        bg="#9ab3f27a"
        w={100}
        h={100}
        position="absolute"
        top="500px"
        left="1261px"
        zIndex={0}
        />
      <Box
        bg="#9ab3f27a"
        w={100}
        h={100}
        position="absolute"
        top="620px"
        left="370px"
        zIndex={0}
        />
      <Box
        bg="#9ac6f27f"
        w={50}
        h={50}
        position="absolute"
        top="200px"
        left="1127px"
        zIndex={0}
        />
        <Box
        bg="#9ac6f27f"
        w={50}
        h={50}
        position="absolute"
        top="47px"
        left="78px"
        zIndex={0}
        />
    </Container>
    
    <AbsoluteCenter>
      <Box
        borderRadius={8}
        bgGradient="to-br" gradientFrom="#0D238C" gradientTo="#4766B4"
        px={12}
        py={6}
      >
        <Stack justifyContent="center" alignItems="center">
          <Heading>LOGIN</Heading>
          <Field.Root>
            <Field.Label>
              Email:
            </Field.Label>
            <Input />
            <Field.HelperText />
            <Field.ErrorText />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              Password:
            </Field.Label>
            <Input />
            <Field.HelperText />
            <Field.ErrorText />
          </Field.Root>

          <Button>
            Login
          </Button>
        </Stack>
      </Box>
    </AbsoluteCenter>
    
    </>);
}