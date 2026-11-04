import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useQuery from '#/hooks/use-query'
import type { RecordDeleteParams, RecordItem } from '#/types'

export const Route = createFileRoute('/records/$id')({
  beforeLoad: ({ context }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/login' })
    }
  },
  component: RecordDetails,
})

function RecordDetails() {
  const { id } = Route.useParams()
  const { accessToken } = Route.useRouteContext()
  const recordId = Number(id)
  const { data: record, isLoading, error } = useQuery<RecordItem | null, RecordDeleteParams>({
    initialData: null,
    queryFn: apiClient.records.get,
    queryParams: { accessToken: accessToken ?? '', id: recordId },
    enabled: Boolean(accessToken && Number.isInteger(recordId)),
  })

  return (
    <main className="container">
      <Link to="/records">Назад к заявкам</Link>
      <h1>Заявка</h1>
      {isLoading && <p aria-busy="true">Загрузка...</p>}
      {error && <p className="error">Ошибка: {error.message}</p>}
      {record && (
        <article>
          <h2>{record.course.title}</h2>
          <p>Пользователь: {record.author.username}</p>
          <p>Создана: {new Date(record.created_at).toLocaleString('ru-RU')}</p>
        </article>
      )}
    </main>
  )
}
