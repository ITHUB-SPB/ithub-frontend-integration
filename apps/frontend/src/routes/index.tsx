import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import apiClient from '#/api/client'
import { useEffect, useState } from 'react'


export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (context.accessToken) throw redirect({ to: '/records' })
  },
  component: Home
})

function Home() {
  const [courses, setCourses] = useState<{id: string; title: string}[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([apiClient.auth.courses(), apiClient.auth.summary()])
      .then(([courseList, courseCounts]) => { setCourses(courseList); setCounts(courseCounts) })
      .catch((reason: Error) => setError(reason.message))
  }, [])

  return (
    <main className="container">
      <h1>Курсы</h1>
      {error && <p>Ошибка: {error}</p>}
      {!courses.length && !error ? <p>Загрузка...</p> : <table>
        <thead><tr><th>Курс</th><th>Количество заявок</th></tr></thead>
        <tbody>{courses.map(course => <tr key={course.id}><td>{course.title}</td><td>{counts[course.id] || 0}</td></tr>)}</tbody>
      </table>}
      <p><Link to="/login">Войти</Link> или <Link to="/register">зарегистрироваться</Link></p>
    </main>
  )
}
