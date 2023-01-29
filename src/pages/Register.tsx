import {
  Box,
  Button,
  Card,
  Center,
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

import styles from '../styles/auth_styles'

const Register = (): JSX.Element => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isFirstnameFocused, setIsFirstnameFocused] = useState(false)
  const [isLastnameFocused, setIsLastnameFocused] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false)

  const isFirstnameError = !/^[a-z ,.'-]+$/i.test(firstname) && isFirstnameFocused
  const isLastnameError = !/^[a-z ,.'-]+$/i.test(lastname) && isLastnameFocused
  const isEmailError = !/^([a-z0-9_.]{3,})@([a-z0-9-+]{2,})\.([a-z0-9.-]{2,})$/i.test(email) && isEmailFocused
  const isPasswordError =
    !/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(password) &&
    isPasswordFocused

  const isConfirmPasswordError =
    !/^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(confirmPassword) &&
    isConfirmPasswordFocused &&
    password !== confirmPassword

  return (
    <Center bg="midnightGreen.500" style={styles.bg}>
      <Box position="fixed" bgGradient="linear(135deg, malachite.400, teal)" style={styles.square as object} />
      <Box position="fixed" bgGradient="linear(45deg, ripeMango.500, yellow)" style={styles.circle as object} />
      <Box position="fixed" bgGradient="linear(45deg, gray.400, isabelline.100)" style={styles.triangle as object} />
      <Box position="fixed" bgGradient="linear(to-r, teal, cyan)" style={styles.diamond as object} />

      <Box position="fixed" bgGradient="linear(135deg, malachite.400, teal)" style={styles.square1 as object} />
      <Box position="fixed" bgGradient="linear(45deg, ripeMango.500, yellow)" style={styles.circle1 as object} />
      <Box position="fixed" bgGradient="linear(45deg, gray.400, isabelline.100)" style={styles.triangle1 as object} />
      <Box position="fixed" bgGradient="linear(to-r, teal, cyan)" style={styles.diamond1 as object} />

      <Card bg="white" style={styles.card}>
        <form className="form-login">
          <Stack spacing={4} w="md">
            <Button
              aria-label="Sign up using Google Account"
              title="Signing up in using Google Account"
              leftIcon={<FcGoogle />}
              variant="outline"
              colorScheme="midnightGreen"
              alignItems="center"
              justifyContent="center"
            >
              Sign Up using Google
            </Button>
            <Text as="i" align="center">
              OR
            </Text>
            <hr />
            <FormControl isInvalid={isFirstnameError}>
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
                    setIsFirstnameFocused(true)
                  }}
                />
              </InputGroup>
              {isFirstnameFocused ? <FormErrorMessage>Enter a valid First Name</FormErrorMessage> : <></>}
            </FormControl>
            <FormControl isInvalid={isLastnameError}>
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
                    setIsLastnameFocused(true)
                  }}
                />
              </InputGroup>
              {isLastnameFocused ? <FormErrorMessage>Enter a valid Last Name</FormErrorMessage> : <></>}
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
              colorScheme="midnightGreen"
              variant="solid"
              aria-label="Login Into GoalKeeper"
              type="submit"
            >
              Sign Up
            </Button>
            <Box textAlign="center" paddingY="20px">
              <Text>
                Already a member? Sign in
                <Link href="/login" color="midnightGreen.500">
                  {' '}
                  here.
                </Link>
              </Text>
            </Box>
          </Stack>
        </form>
      </Card>
    </Center>
  )
}

export default Register
