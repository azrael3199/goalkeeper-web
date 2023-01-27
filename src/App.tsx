import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import routes from './routes'
import theme from './theme'

const router = createBrowserRouter(routes)
function App(): JSX.Element {
  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <RouterProvider router={router} />
    </ChakraProvider>
  )
}

export default App
