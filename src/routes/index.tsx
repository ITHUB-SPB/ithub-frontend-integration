import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

type Record = {
  id: string
  course: string
  user: string
}

function Home() {
  const [records, setRecords] = useState<Record[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [search, setSearch] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
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
      const records = await getRecords(search)
      setRecords(records)
    } catch (error: unknown) {
      setError(error as Error)
    }
    setLoading(false)
  }

  // const handleClick = async () => {
  //   const records = await getRecords()
  //   setRecords(records)
  // }

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
        type="text"
        name="search"
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
                <tr key={id}>
                  <td>№{id}</td>
                  <td>{course}</td>
                  <td>№{user}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      )}

      {/* <p className="mt-4 text-lg">
        <button type="button" onClick={handleClick}>Загрузить записи</button>
      </p> */}
    </div>
  )
}
