import { createFileRoute, Link } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useQuery from '#/hooks/use-query'

export const Route = createFileRoute('/records/$id')({
  component: RecordDetails,
})

type RecordDetail = {
  id: string
  course: {
    id: string
    title: string
  }
  author: {
    username: string
    role: string
  }
  created_at: string
}

export default function RecordDetails() {
  const { id } = Route.useParams()
  const { accessToken } = Route.useRouteContext()

  const { data: record, isLoading, error } = useQuery<RecordDetail | null, { accessToken: string | null; id: string }>({
    initialData: null,
    queryFn: async ({ accessToken, id }) => {
      const res = await fetch(`http://127.0.0.1:8000/records/${id}`, {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        }
      })
      if (!res.ok) throw new Error('Не удалось загрузить запись')
      return res.json()
    },
    queryParams: { accessToken, id }
  })

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold">FastAPI Integration</h1>
        <p style={{ color: 'red' }}>Ошибка: {error.message}</p>
        <Link to="/">Все записи</Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">FastAPI Integration</h1>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : record ? (
        <article style={{ marginTop: '20px' }}>
          <header>Запись № {record.id}</header>
          <main>
            <p><strong>Курс:</strong> {record.course?.title}</p>
            <p><strong>Автор:</strong> {record.author?.username}</p>
            <p><strong>Дата создания:</strong> {record.created_at}</p>
          </main>
        </article>
      ) : (
        <p>Запись не найдена</p>
      )}

      <p style={{ marginTop: '20px' }}>
        <Link to="/">← Все записи</Link>
      </p>
    </div>
  )
}