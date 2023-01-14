import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function Sample(): JSX.Element {
  const [count, setCount] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <div className="App">
          <div>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
              <img src="/vite.svg" className="logo" alt="Vite logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={(): void => setCount((count: number): number => count + 1)}>count is {count}</button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </div>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default Sample
