import ReactDOM from 'react-dom/client'
import { useState, useEffect } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import apiClient from '#/api/client'

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

  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem(storageKey)
    } else {
      localStorage.setItem(storageKey, accessToken)

      apiClient.auth.me({
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(data => {
        setUsername(data.username)
      })
        .catch((_: unknown) => {
          setAccessToken(null)
        })

    }
  }, [accessToken])

  return (
    <RouterProvider router={router} context={{ accessToken, username, setAccessToken }} />
  )
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<Wrapper />)
}
