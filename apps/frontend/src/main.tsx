import ReactDOM from 'react-dom/client'
import { useEffect, useState } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import apiClient from '#/api/client'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    accessToken: null,
    user: null,
    setAccessToken: () => {},
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

type AppUser = Awaited<ReturnType<typeof apiClient.auth.me>>

const rootElement = document.getElementById('app')!

function Wrapper() {
  const storageKey = 'records__access_token'
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(storageKey),
  )
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem(storageKey)
      setUser(null)
      return
    }

    localStorage.setItem(storageKey, accessToken)
    void apiClient.auth.me(accessToken)
      .then(setUser)
      .catch(() => setAccessToken(null))
  }, [accessToken])

  return (
    <RouterProvider
      router={router}
      context={{ accessToken, user, setAccessToken }}
    />
  )
}

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(<Wrapper />)
}
