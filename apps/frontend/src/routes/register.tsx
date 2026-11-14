import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import apiClient from '#/api/client'


export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.accessToken) {
      throw redirect({ to: '/' })
    }
  },
  component: Register,
})

function Register() {
  const navigate = Route.useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      await apiClient.auth.register({ username, password })
      setSuccess(true)
      setTimeout(() => {
        navigate({ to: '/login' })
      }, 1500)
    } catch (err: unknown) {
      setError((err as Error).message || 'Ошибка регистрации')
    }
  }

  return (
    <main className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Логин" required />
        <input type="password" name="password" placeholder="Пароль" required />
        <button type="submit">Зарегистрироваться</button>
      </form>

      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      {success && <p style={{ color: 'green' }}>Успешно! Перенаправление на вход...</p>}

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </main>
  )
}