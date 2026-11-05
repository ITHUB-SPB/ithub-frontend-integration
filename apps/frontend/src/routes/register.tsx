import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import apiClient from '#/api/client'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context.accessToken) throw redirect({ to: '/records' })
  },
  component: Register,
})

function Register() {
  const navigate = Route.useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setLoading(true)
    setError('')
    try {
      await apiClient.auth.register({ username: String(form.get('username')), password: String(form.get('password')) })
      await navigate({ to: '/login' })
    } catch (reason) {
      setError((reason as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return <main className="container"><h1>Регистрация</h1><form onSubmit={submit}>
    {error && <p>Ошибка: {error}</p>}
    <label>Логин<input name="username" minLength={2} required /></label>
    <label>Пароль<input name="password" type="password" minLength={6} required /></label>
    <button disabled={loading}>{loading ? 'Загрузка...' : 'Зарегистрироваться'}</button>
  </form><p>Уже есть аккаунт? <Link to="/login">Войти</Link></p></main>
}
