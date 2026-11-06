import ReactDOM from 'react-dom/client'
import { useState, useEffect } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    accessToken: null,
    username: null,
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
  const storageKey = 'records__access_token'

  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(storageKey)
  )

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(storageKey, accessToken);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [accessToken]);

  return (
    <RouterProvider router={router} context={{ accessToken, username: null, setAccessToken }} />
  )
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<Wrapper />)
}
