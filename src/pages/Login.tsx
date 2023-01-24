import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FiKey, FiMail } from 'react-icons/fi'
import { MdSend } from 'react-icons/md'

const Login = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const isEmailError = !/^([a-z0-9_.]{3,})@([a-z0-9-+]{2,})\.([a-z0-9.-]{2,})$/i.test(email) && isEmailFocused
  const isPasswordError =
    !/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(password) &&
    isPasswordFocused

  return (
    <form className="form-login">
      <Stack spacing={4} w="md">
        <Button
          aria-label="Sign in using Google Account"
          title="Signing in using Google Account"
          leftIcon={<FcGoogle />}
          variant="outline"
          colorScheme="teal"
          alignItems="center"
          justifyContent="center"
        >
          Login Using Google
        </Button>
        <Text as="i" align="center">
          OR
        </Text>
        <hr />
        <FormControl isInvalid={isEmailError}>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftAddon pointerEvents="none" color="gray.600">
              <FiMail />
            </InputLeftAddon>
            <Input
              name="email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setEmail(e.target.value)
                setIsEmailFocused(true)
              }}
            />
          </InputGroup>
          {isEmailError ? <FormErrorMessage>Enter A Valid Email Address!</FormErrorMessage> : <></>}
        </FormControl>

        <FormControl isInvalid={isPasswordError}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <InputLeftAddon pointerEvents="none" color="gray.600">
              <FiKey />
            </InputLeftAddon>
            <Input
              name="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setPassword(e.target.value)
                setIsPasswordFocused(true)
              }}
            />
          </InputGroup>

          {isPasswordError ? <FormErrorMessage>Enter A Valid Password!</FormErrorMessage> : <></>}
        </FormControl>
        <Button
          leftIcon={<MdSend />}
          colorScheme="teal"
          variant="solid"
          aria-label="Login Into GoalKeeper"
          type="submit"
        >
          Login
        </Button>
        <Box textAlign="center" paddingY="20px">
          <Text>
            Not a member yet? Sign up
            <Link href="/register" color="teal.400">
              {' '}
              here.
            </Link>
          </Text>
        </Box>
      </Stack>
    </form>
  )
}

export default Login
