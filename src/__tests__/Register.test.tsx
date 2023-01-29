import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Register from '../pages/Register'
import theme from '../theme'

describe('Register Page', (): void => {
  beforeEach((): void => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <ChakraProvider theme={extendTheme(theme)}>
          <Register />
        </ChakraProvider>
      </MemoryRouter>
    )
  })
  test('should render sign up with google', (): void => {
    expect(screen.getByText(/Sign Up Using Google/i)).toBeInTheDocument()
  })

  describe('should render First Name with', (): void => {
    test('correct label', (): void => {
      expect(screen.getByText(/First Name/i)).toBeInTheDocument()
    })
    test('correct input element', (): void => {
      expect(screen.getByPlaceholderText(/Enter First Name/i)).toBeInTheDocument()
    })
    test('error if firstname is invalid', (): void => {
      const firstnameInput = screen.getByPlaceholderText(/Enter First Name/i)
      fireEvent.change(firstnameInput, { target: { value: '12345' } })
      expect(screen.getByText(/Enter A valid First Name/i)).toBeInTheDocument()
    })
    test('no error if firstname is valid', (): void => {
      const passwordInput = screen.getByPlaceholderText(/Enter Password/i)
      fireEvent.change(passwordInput, { target: { value: 'Jacob' } })
      expect(screen.queryByText(/Enter A valid First Name/i)).not.toBeInTheDocument()
    })
  })

  describe('should render Last Name with', (): void => {
    test('correct label', (): void => {
      expect(screen.getByText(/Last Name/i)).toBeInTheDocument()
    })
    test('correct input element', (): void => {
      expect(screen.getByPlaceholderText(/Enter Last Name/i)).toBeInTheDocument()
    })
  })

  describe('should render Password with', (): void => {
    test('correct Label', (): void => {
      expect(screen.getByText('Password')).toBeInTheDocument()
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

  describe('should render Confirm Password with', (): void => {
    test('correct Label', (): void => {
      expect(screen.getByText('Confirm Password')).toBeInTheDocument()
    })
    test('correct input element', (): void => {
      expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument()
    })
    test('disabled when password is empty', (): void => {
      expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeDisabled()
    })
    test('error if password is invalid', (): void => {
      const passwordInput = screen.getByPlaceholderText(/Enter Password/i)
      fireEvent.change(passwordInput, { target: { value: 'THis@Valid123' } })

      const confirmPasswordInput = screen.getByPlaceholderText(/Confirm Password/i)
      fireEvent.change(confirmPasswordInput, { target: { value: 'invalid' } })
      expect(screen.getByText(/Incorrect Password format or Passwords don't match!/i)).toBeInTheDocument()
    })
    test('no error if password is valid', (): void => {
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirm Password/i)
      fireEvent.change(confirmPasswordInput, { target: { value: 'THis@Valid123' } })
      expect(screen.queryByText(/Incorrect Password format or Passwords don't match!/i)).not.toBeInTheDocument()
    })
  })

  test('should render login button', (): void => {
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })
})
