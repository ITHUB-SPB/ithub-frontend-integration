import { useState } from 'react'
import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useMutation from '#/hooks/use-mutation'

export const Route = createFileRoute('/record/create')({
  beforeLoad: ({ context }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/login' })
    }
  },
  component: CreateRecord,
})

function CreateRecord() {
  const { accessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const [courseId, setCourseId] = useState('')

  const { mutate, isLoading, error } = useMutation({
    mutationFn: apiClient.records.create,
    onSuccess: () => {
      navigate({ to: '/' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId) return
    mutate({ accessToken, courseId })
  }

  return (
    <main className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <h1>Создать новую заявку</h1>
      
      <form onSubmit={handleSubmit}>
        <label>
          ID Курса:
          <input 
            type="text" 
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)} 
            placeholder="Введите ID курса" 
            required 
          />
        </label>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Создать заявку'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Ошибка: {error.message}</p>}

      <p style={{ marginTop: '1rem' }}>
        <Link to="/">Назад к списку</Link>
      </p>
    </main>
  )
}