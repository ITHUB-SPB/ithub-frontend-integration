import { Outlet, createRootRoute, HeadContent } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import picoCss from '../styles/pico.classless.css?url'

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [
      {
        "rel": "stylesheet",
        "href": picoCss
      }
    ]
  })
})

function RootComponent() {
  return (
    <>
      <HeadContent />
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
