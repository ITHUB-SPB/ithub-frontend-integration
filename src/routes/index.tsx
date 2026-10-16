import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const getRecords = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/records')
      if (!response.ok) {
        throw new Error('Сетевая ошибка')
      }
      return await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = async () => {
    const records = await getRecords()
    console.log(records)
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">FastAPI Integration</h1>
      <p className="mt-4 text-lg">
        <button type="button" onClick={handleClick}>Загрузить записи</button>
      </p>
    </div>
  )
}
