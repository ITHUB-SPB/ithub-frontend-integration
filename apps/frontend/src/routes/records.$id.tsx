import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

type Record = {
  id: string
  course: string
  user: string
}

export const Route = createFileRoute('/records/$id')({
  component: RecordDetails,
})

function RecordDetails() {
  const { id } = Route.useParams()

  const [record, setRecord] = useState<Record | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadRecord()
  }, [])

  const getRecord = async () => {
    try {
      const url = new URL(`/records/${id}`, 'http://127.0.0.1:8000')

      const response = await fetch(url.toString())

      if (response.status === 404) {
        throw new Error('Запись не найдена')
      }

      if (!response.ok) {
        throw new Error('Сетевая ошибка')
      }

      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const loadRecord = async () => {
    try {
      setLoading(true)
      setError(null)
      const record = await getRecord()
      setRecord(record)
    } catch (error: unknown) {
      setError(error as Error)
    }
    setLoading(false)
  }

  if (error) {
    return (
      <div>
        <h1>FastAPI Integration</h1>
        <Link to="/">Все записи</Link>
        <p>Ошибка: {error.message} </p>
      </div>
    )
  }

  return (
    <div>
      <h1>FastAPI Integration</h1>

      {isLoading ? (
        <div>
          <h1>FastAPI Integration</h1>
          <p>Загрузка...</p>
        </div>
      ) : (
        <article>
          <header>Запись</header>
          <main>
            <p>{record?.course}</p>
            <p>{record?.user}</p>
          </main>
        </article>
      )}

      <Link to="/">Все записи</Link>
    </div>
  )
}