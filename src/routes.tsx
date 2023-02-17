import Login from './pages/Login'
import Register from './pages/Register'
import Sample from './Sample'

const routes = [
  {
    path: '/',
    element: <Sample />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]

export default routes
