import { createFileRoute, redirect, Link } from '@tanstack/react-router'

import apiClient from '#/api/client'
import useQuery from '#/hooks/use-query'
import useMutation from '#/hooks/use-mutation'

type UserSearch = {
  username?: string
}

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/login' })
    }

    if (!context.username) {
      try {
        const { username } = await apiClient.auth.me({ accessToken: context.accessToken })
        return { ...context, username }
      } catch {
        context.setAccessToken(null)
        throw redirect({ to: '/login' })
      }
    }
  },
  validateSearch: (search: Record<string, unknown>): UserSearch => ({
    username: (search?.username as string) || undefined
  }),
  component: Home
})

type RecordItem = {
  id: string
  course: {
    id: string,
    title: string
  }
  author: {
    username: string,
    role: 'user'
  }
  created_at: string
}

type RecordQueryParams = {
  accessToken: string | null;
  authorId: string | null;
}

function Home() {
  const { accessToken, username } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const {
    data: records,
    isLoading,
    error,
  } = useQuery<RecordItem[], RecordQueryParams>({
    initialData: [],
    queryFn: apiClient.records.all,
    queryParams: {
      accessToken,
      authorId: username
    }
  })

  const { mutate: deleteRecord } = useMutation({
    mutationFn: apiClient.records.delete,
    onSuccess: () => {
      window.location.reload()
    }
  })

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold">FastAPI Integration</h1>
        <p>Ошибка: {error.message} </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span>Пользователь: <strong>{username}</strong></span>
        <Link to="/records/create" role="button" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          + Создать заявку
        </Link>
      </nav>

      <h1 className="text-4xl font-bold">FastAPI Integration</h1>

      {isLoading ? (
        <div className="p-8">
          <h1 className="text-4xl font-bold">FastAPI Integration</h1>
          <p>Загрузка...</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <td>№</td>
              <td>Курс</td>
              <td>Создан</td>
              <td>Действия</td>
            </tr>
          </thead>
          <tbody>
            {!records?.length
              ? (
                <tr>
                  <td colSpan={4}>Записей пока нет</td>
                </tr>
              )
              : records.map(({ id, course, created_at }) => (
                <tr 
                  key={id} 
                  onClick={() => navigate({ to: '/records/$id', params: { id } })}
                  style={{ cursor: 'pointer' }}
                >
                  <td>№ {id}</td>
                  <td>{course.title}</td>
                  <td>{created_at}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Точно хотите удалить эту запись?')) {
                          deleteRecord({ accessToken, recordId: id })
                        }
                      }}
                      style={{ background: '#d9534f', border: 'none', padding: '4px 8px', color: '#fff', width: 'auto' }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      )}
    </div>
  )
}