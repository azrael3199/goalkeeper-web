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
import { CgProfile } from 'react-icons/cg'
import { MdSend } from 'react-icons/md'

const Register = (): JSX.Element => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false)

  const isEmailError = !/^([a-z0-9_.]{3,})@([a-z0-9-+]{2,})\.([a-z0-9.-]{2,})$/i.test(email) && isEmailFocused
  const isPasswordError =
    !/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(password) &&
    isPasswordFocused

  const isConfirmPasswordError =
    !/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(confirmPassword) &&
    isConfirmPasswordFocused &&
    password !== confirmPassword

  return (
    <form className="form-login">
      <Stack spacing={4} w="md">
        <Button
          aria-label="Sign up using Google Account"
          title="Signing up in using Google Account"
          leftIcon={<FcGoogle />}
          variant="outline"
          colorScheme="teal"
          alignItems="center"
          justifyContent="center"
        >
          Sign Up using Google
        </Button>
        <Text as="i" align="center">
          OR
        </Text>
        <hr />
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <InputGroup>
            <InputLeftAddon pointerEvents="none" color="gray.600">
              <CgProfile />
            </InputLeftAddon>
            <Input
              name="firstname"
              type="text"
              placeholder="Enter First Name"
              value={firstname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setFirstname(e.target.value.trim())
              }}
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <InputGroup>
            <InputLeftAddon pointerEvents="none" color="gray.600">
              <CgProfile />
            </InputLeftAddon>
            <Input
              name="lastname"
              type="text"
              placeholder="Enter Last Name"
              value={lastname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setLastname(e.target.value.trim())
              }}
            />
          </InputGroup>
        </FormControl>
        <FormControl isInvalid={isEmailError}>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftAddon pointerEvents="none" color="gray.600">
              <FiMail />
            </InputLeftAddon>
            <Input
              name="email"
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setEmail(e.target.value.trim())
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
                setPassword(e.target.value.trim())
                setIsPasswordFocused(true)
              }}
            />
          </InputGroup>

          {isPasswordError ? <FormErrorMessage>Enter A Valid Password!</FormErrorMessage> : <></>}
        </FormControl>
        <FormControl isInvalid={isConfirmPasswordError}>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <InputLeftAddon pointerEvents="none" color="gray.600">
              <FiKey />
            </InputLeftAddon>
            <Input
              disabled={!password}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setConfirmPassword(e.target.value.trim())
                setIsConfirmPasswordFocused(true)
              }}
            />
          </InputGroup>

          {isConfirmPasswordError ? (
            <FormErrorMessage>Incorrect Password format or Passwords don&apos;t match!</FormErrorMessage>
          ) : (
            <></>
          )}
        </FormControl>
        <Button
          leftIcon={<MdSend />}
          colorScheme="teal"
          variant="solid"
          aria-label="Login Into GoalKeeper"
          type="submit"
        >
          Sign Up
        </Button>
        <Box textAlign="center" paddingY="20px">
          <Text>
            Already a member? Sign in
            <Link href="/login" color="teal.400">
              {' '}
              here.
            </Link>
          </Text>
        </Box>
      </Stack>
    </form>
  )
}

export default Register
