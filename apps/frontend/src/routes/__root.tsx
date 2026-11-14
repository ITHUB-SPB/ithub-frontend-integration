import { Outlet, createRootRouteWithContext, HeadContent } from '@tanstack/react-router'
import { useState } from 'react'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import picoCss from '../styles/pico.classless.css?url'

type UserContext = {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  username: string | null
  logout: () => void
}

export const Route = createRootRouteWithContext<UserContext>()({
  component: RootComponent,
  head: () => ({
    links: [
      {
        "rel": "stylesheet",
        "href": picoCss
      }
    ]
  }),
})

function RootComponent() {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    return localStorage.getItem('accessToken')
  })
  const [username] = useState<string | null>(null)

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token)
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  const logout = () => {
    setAccessToken(null)
  }

  return (
    <>
      <HeadContent />
      {accessToken && (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
          <span>{username ? `Пользователь: ${username}` : 'профиль'}</span>
          <button onClick={logout} style={{ width: 'auto' }}>Выйти</button>
        </header>
      )}
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}