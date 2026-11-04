import type { SubmitEvent } from 'react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useMutation from '#/hooks/use-mutation'
import type { LoginResultData, RegisterData } from '#/types'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.accessToken) {
      throw redirect({ to: '/records' })
    }
  },
  component: Login,
})

function Login() {
  const { setAccessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const { error, isLoading, mutate } = useMutation<LoginResultData, RegisterData>({
    mutationFn: apiClient.auth.login,
    onSuccess: result => {
      setAccessToken(result.access_token)
      void navigate({ to: '/' })
    },
  })

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    void mutate({
      username: String(formData.get('username')),
      password: String(formData.get('password')),
    })
  }

  return (
    <main className="container narrow">
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">Ошибка: {error.message}</p>}
        <label>
          Логин
          <input name="username" minLength={2} required />
        </label>
        <label>
          Пароль
          <input name="password" type="password" minLength={6} required />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </button>
      </form>
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
      <Link to="/">На главную</Link>
    </main>
  )
}
