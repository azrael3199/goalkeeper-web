import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import routes from './routes'

const router = createBrowserRouter(routes)

function App(): JSX.Element {
  return <RouterProvider router={router} />
}

export default App
