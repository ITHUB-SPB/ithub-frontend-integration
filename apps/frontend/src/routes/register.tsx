import type { SubmitEvent } from 'react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useMutation from '#/hooks/use-mutation'
import type { RegisterData } from '#/types'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.accessToken) {
      throw redirect({ to: '/records' })
    }
  },
  component: Register,
})

function Register() {
  const navigate = Route.useNavigate()
  const { error, isLoading, mutate } = useMutation<void, RegisterData>({
    mutationFn: apiClient.auth.register,
    onSuccess: () => {
      void navigate({ to: '/login' })
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
      <h1>Регистрация</h1>
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
          {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
      <Link to="/">На главную</Link>
    </main>
  )
}
