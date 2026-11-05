import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useQuery from '#/hooks/use-query'
import type { RecordQueryParams, RecordItem } from '#/types'
import { useState } from 'react'

export const Route = createFileRoute('/records/')({
  beforeLoad: async ({ context }) => {
    if (!context.accessToken) throw redirect({ to: '/login' })
    if (!context.username) {
      try {
        const user = await apiClient.auth.me({ accessToken: context.accessToken })
        return { username: user.username }
      } catch {
        context.setAccessToken(null)
        throw redirect({ to: '/login' })
      }
    }
  },
  component: Records,
})

function Records() {
  const { accessToken, username, setAccessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const [message, setMessage] = useState('')
  const { data: records, isLoading, error } = useQuery<RecordItem[], RecordQueryParams>({
    initialData: [], queryFn: apiClient.records.all, queryParams: { accessToken, authorId: username },
  })

  async function remove(id: string) {
    if (!window.confirm('Удалить заявку?')) return
    try {
      await apiClient.records.delete({ accessToken: accessToken!, id })
      setMessage('Заявка удалена')
      window.location.reload()
    } catch (reason) {
      setMessage(`Ошибка: ${(reason as Error).message}`)
    }
  }

  function logout() { setAccessToken(null); navigate({ to: '/' }) }

  return <main className="container">
    <nav><span>{username}</span><button onClick={logout}>Выйти</button></nav>
    <h1>Мои заявки</h1><p>{message}</p>
    <p><Link to="/records/create">Создать заявку</Link></p>
    {isLoading ? <p>Загрузка...</p> : error ? <p>Ошибка: {error.message}</p> : <table>
      <thead><tr><th>Курс</th><th>Создана</th><th></th></tr></thead>
      <tbody>{records.map(record => <tr key={record.id}><td>{record.course.title}</td><td>{record.created_at}</td><td><button onClick={() => remove(record.id)}>Удалить</button></td></tr>)}</tbody>
    </table>}
  </main>
}
