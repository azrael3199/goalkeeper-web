import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import Login from '../pages/Login'
import theme from '../theme'

describe('Login Page', (): void => {
  beforeEach((): void => {
    render(
      <ChakraProvider theme={extendTheme(theme)}>
        <Login />
      </ChakraProvider>
    )
  })
  test('should render login with google', (): void => {
    expect(screen.getByText(/Login Using Google/i)).toBeInTheDocument()
  })
  describe('should render Email with', (): void => {
    test('correct Label', (): void => {
      expect(screen.getByText(/email/i)).toBeInTheDocument()
    })
    test('correct input element', (): void => {
      expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument()
    })
    test('error if email is invalid', (): void => {
      const passwordInput = screen.getByPlaceholderText(/Enter Email/i)
      fireEvent.change(passwordInput, { target: { value: 'invalid' } })
      expect(screen.getByText(/Enter A Valid Email Address!/i)).toBeInTheDocument()
    })
    test('no error if email is valid', (): void => {
      const passwordInput = screen.getByPlaceholderText(/Enter Email/i)
      fireEvent.change(passwordInput, { target: { value: 'THis123@Valid.com' } })
      expect(screen.queryByText(/Enter A Valid Email Address!/i)).not.toBeInTheDocument()
    })
  })
  describe('should render Password with', (): void => {
    test('correct Label', (): void => {
      expect(screen.getByText(/password/i)).toBeInTheDocument()
    })
    test('correct input element', (): void => {
      expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument()
    })
    test('error if password is invalid', (): void => {
      const passwordInput = screen.getByPlaceholderText(/Enter Password/i)
      fireEvent.change(passwordInput, { target: { value: 'invalid' } })
      expect(screen.getByText(/Enter A Valid Password/i)).toBeInTheDocument()
    })
    test('no error if password is valid', (): void => {
      const passwordInput = screen.getByPlaceholderText(/Enter Password/i)
      fireEvent.change(passwordInput, { target: { value: 'THis@Valid123' } })
      expect(screen.queryByText(/Enter A Valid Password!/i)).not.toBeInTheDocument()
    })
  })
  test('should render login button', (): void => {
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
})
