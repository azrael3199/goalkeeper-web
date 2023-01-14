import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import routes from './routes'

describe('Routes', (): void => {
  it('should render Sample', (): void => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
    })
    const { getByText } = render(<RouterProvider router={router} />)

    expect(getByText(/Vite \+ React/i)).toBeInTheDocument()
    expect(getByText(/Click on the Vite and React logos to learn more/)).toBeInTheDocument()
  })
})
