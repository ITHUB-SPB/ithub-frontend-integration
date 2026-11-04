import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import apiClient from '#/api/client'
import useMutation from '#/hooks/use-mutation'
import useQuery from '#/hooks/use-query'
import type { RecordDeleteParams, RecordsAll } from '#/types'

export const Route = createFileRoute('/records')({
  beforeLoad: ({ context }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/login' })
    }
  },
  component: Records,
})

function Records() {
  const { accessToken, user, setAccessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const [message, setMessage] = useState('')
  const {
    data: records,
    isLoading,
    error,
    refetch,
  } = useQuery<RecordsAll, { accessToken: string; authorId?: string }>({
    initialData: { data: [], data_count: 0 },
    queryFn: apiClient.records.all,
    queryParams: { accessToken: accessToken ?? '', authorId: user?.username },
    enabled: Boolean(accessToken && user),
  })

  const deleteMutation = useMutation<void, RecordDeleteParams>({
    mutationFn: apiClient.records.delete,
    onSuccess: () => {
      setMessage('Заявка удалена')
      void refetch()
    },
  })

  const logout = () => {
    setAccessToken(null)
    void navigate({ to: '/login' })
  }

  const deleteRecord = (id: number) => {
    if (!accessToken || !window.confirm('Удалить заявку?')) {
      return
    }

    setMessage('')
    void deleteMutation.mutate({ accessToken, id })
  }

  if (!user || isLoading) {
    return <main className="container"><p aria-busy="true">Загрузка...</p></main>
  }

  return (
    <main className="container">
      <nav>
        <strong>Мои заявки</strong>
        <span>
          {user.username}
          {' '}
          <button className="secondary" onClick={logout}>Выйти</button>
        </span>
      </nav>

      <div className="actions">
        <Link role="button" to="/records/create">Создать заявку</Link>
        <Link to="/">На главную</Link>
      </div>

      {error && <p className="error">Ошибка: {error.message}</p>}
      {deleteMutation.error && (
        <p className="error">Ошибка: {deleteMutation.error.message}</p>
      )}
      {message && <p className="success">{message}</p>}

      {!error && records.data.length === 0 && <p>Заявок пока нет.</p>}
      {records.data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Курс</th>
              <th>Дата</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {records.data.map(record => (
              <tr key={record.id}>
                <td>{record.course.title}</td>
                <td>{new Date(record.created_at).toLocaleString('ru-RU')}</td>
                <td>
                  <button
                    className="secondary"
                    onClick={() => deleteRecord(record.id)}
                    disabled={deleteMutation.isLoading}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
