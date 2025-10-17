"use client"

import { 
  AbsoluteCenter, 
  Box, 
  Container, 
  Heading, 
  Field, 
  Input, 
  Stack,
  Button, Text
} from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react"

const getCsrfToken = async () => {
  const res = await fetch('http://localhost:8000/api/login/', {
    credentials: 'include',
  });
  const data = await res.json();
  return data.csrfToken;
};

export default function LoginPage(){
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginClicked, setLoginClicked] = useState(false);

  useEffect(()=>{
    const fetchCsrf = async () => {
      const csrf = await getCsrfToken();
      setCsrfToken(csrf);
    }

    fetchCsrf()
  }, []);

  const handleLogin = async () => {
    setLoginClicked(true);
    const res = await fetch('http://localhost:8000/api/login/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    const data = await res.json();
    if (res.ok){
      router.push('/main');
    }else console.log('Login failed');
  }

  let loginButtonContent = <Text>LOGIN</Text>
  if(loginClicked){
    loginButtonContent = <Spinner />
  }

  return (<>
  {/* background decoration boxes */}
  <Container h="100vh" overflow="hidden">
    <Heading 
      color={"#002992"}
      ml={10}
      mt={10}
      zIndex="1"
      position="absolute"
      top={1}
      left={4}
      size={"5xl"}
      fontFamily="var(--font-roboto-condensed)"
    >
      DAM-N
    </Heading>

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
      zIndex="0"
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
        <Heading
        size={"4xl"}
        fontFamily="var(--font-roboto-condensed)">
          LOGIN
        </Heading>
        <Field.Root>
          <Field.Label>
            Email:
          </Field.Label>
          <Input 
          borderRadius={8} bg="#D6DBE6" 
          borderStyle="none"
          color="black"
          p={2}
          value={email}
          onChange={(event)=>setEmail(event.target.value)}
          />
          <Field.HelperText />
          <Field.ErrorText />
        </Field.Root>

        <Field.Root>
          <Field.Label>
            Password:
          </Field.Label>
          <Input 
          borderRadius={8} 
          bg="#D6DBE6" 
          borderStyle="none"
          color="black"
          p={2}
          type="password"
          value={password}
          onChange={(event)=>setPassword(event.target.value)}
          />
          <Field.HelperText />
          <Field.ErrorText />
        </Field.Root>

        <Button 
          bg="#7FEAFF" 
          color="black" 
          px={10} 
          borderRadius={10} 
          py={1} 
          h="fit-content"
          onClick={handleLogin}
          fontFamily="var(--font-roboto-condensed)"
        >
          {loginButtonContent}
        </Button>
      </Stack>
    </Box>
  </AbsoluteCenter>
  
  </>);
}