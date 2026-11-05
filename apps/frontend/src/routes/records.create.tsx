import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import apiClient from '#/api/client'
import type { Course } from '#/types'

export const Route = createFileRoute('/records/create')({
  beforeLoad: ({ context }) => {
    if (!context.accessToken) throw redirect({ to: '/login' })
  },
  component: CreateRecord,
})

function CreateRecord() {
  const { accessToken, username } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => { apiClient.auth.courses().then(setCourses).catch((reason: Error) => setError(reason.message)) }, [])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const course_id = String(new FormData(event.currentTarget).get('course_id'))
    setLoading(true)
    setError('')
    try {
      await apiClient.records.create({ accessToken: accessToken!, course_id })
      await navigate({ to: '/records' })
    } catch (reason) {
      setError((reason as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return <main className="container"><nav>{username}</nav><h1>Новая заявка</h1>
    {error && <p>Ошибка: {error}</p>}
    {!courses.length ? <p>Загрузка...</p> : <form onSubmit={submit}>
      <label>Курс<select name="course_id" required>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
      <button disabled={loading}>{loading ? 'Загрузка...' : 'Создать'}</button>
    </form>}
    <Link to="/records">Назад</Link>
  </main>
}
