import ReactDOM from 'react-dom/client'
import { useState } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    accessToken: null,
    setAccessToken: () => { }
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

const Wrapper = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  return (
    <RouterProvider router={router} context={{ accessToken, setAccessToken }} />
  )
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<Wrapper />)
}
