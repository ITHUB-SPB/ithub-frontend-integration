import { createFileRoute } from '@tanstack/react-router'
import type { SubmitEvent } from 'react'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const { setAccessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target);

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    .then(response => response.json()).then(data => {
      setAccessToken(data.access_token)
      navigate({ to: '/' })
    }).catch(error => console.error(error))
  }

  return (
    <form method='post' onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder='Логин' required />
      <input type="password" name="password" placeholder='Пароль' required />
      <button type="submit">Войти</button>
    </form>
  )
}
