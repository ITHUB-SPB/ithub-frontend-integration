import { useState, useEffect, forwardRef } from 'react'
import { createFileRoute, createLink, type LinkComponent } from '@tanstack/react-router'

type UserSearch = {
  username?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): UserSearch => ({
    username: (search?.username as string) || undefined
  }),
  component: Home
})

// TODO: добавлять фильтрацию в адрес

type RecordItem = {
  id: string
  course: string
  user: string
}

interface BaseRecordLinkProps extends React.TableHTMLAttributes<HTMLTableRowElement> { }

const BaseRecordLink = forwardRef<HTMLTableRowElement, BaseRecordLinkProps>((props, ref) => {
  return <tr ref={ref} {...props}></tr>
})

const CreatedRecordLink = createLink(BaseRecordLink)

const RecordLink: LinkComponent<typeof BaseRecordLink> = (props) => {
  // @ts-expect-error // TODO: narrow children types
  return <CreatedRecordLink {...props} style={{ cursor: "pointer" }} />
}

function Home() {
  const q = Route.useSearch()

  const [records, setRecords] = useState<RecordItem[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [search, setSearch] = useState<string | null>(q.username ?? null)

  useEffect(() => {
    loadRecords()
  }, [search])

  const getRecords = async (searchQuery: string | null) => {
    try {
      const url = new URL('/records', 'http://127.0.0.1:8000')

      if (searchQuery) {
        url.searchParams.append('search', searchQuery)
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error('Сетевая ошибка')
      }

      return await response.json()
    } catch (error) {
      console.error(error)
      throw new Error('Сетевая ошибка')
    }
  }

  const loadRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const records = await getRecords(search)
      setRecords(records)
    } catch (error: unknown) {
      setError(error as Error)
    }
    setLoading(false)
  }

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
      <h1 className="text-4xl font-bold">FastAPI Integration</h1>

      <input
        className="border"
        type="text"
        name="search"
        placeholder='Поиск...'
        value={search ?? ""}
        onChange={e => setSearch(e.target.value)}
      />

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
              <td>Пользователь</td>
            </tr>
          </thead>
          <tbody>
            {!records?.length
              ? (
                <tr>
                  <td colSpan={3}>Записей пока нет</td>
                </tr>
              )
              : records.map(({ id, course, user }) => (
                <RecordLink to="/records/$id" params={{ id }} key={id}>
                  <>
                    <td>№ {id}</td>
                    <td>{course}</td>
                    <td>{user}</td>
                  </>
                </RecordLink>
              ))
            }
          </tbody>
        </table>
      )}
    </div>
  )
}
