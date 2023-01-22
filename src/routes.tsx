import Login from './pages/Login'
import Register from './pages/Register'

const routes = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]

export default routes
