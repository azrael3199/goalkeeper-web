import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import routes from './routes'
import theme from './theme'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)
function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={extendTheme(theme)}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
