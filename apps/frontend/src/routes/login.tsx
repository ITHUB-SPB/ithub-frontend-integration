import { createFileRoute } from '@tanstack/react-router'
import type { SubmitEvent } from 'react'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const { setAccessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const loginUrl = 'http://127.0.0.1:8000/users/login'

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target);

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    fetch(loginUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        username,
        password
      })
    }).then(response => response.json()).then(data => {
      if (!data.access_token) {
        throw new Error('No access token provided')
      }
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
