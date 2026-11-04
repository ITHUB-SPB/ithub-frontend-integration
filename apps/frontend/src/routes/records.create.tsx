import type { SubmitEvent } from 'react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useMutation from '#/hooks/use-mutation'
import useQuery from '#/hooks/use-query'
import type { Course, RecordItem, RecordMutationParams } from '#/types'

export const Route = createFileRoute('/records/create')({
  beforeLoad: ({ context }) => {
    if (!context.accessToken) {
      throw redirect({ to: '/login' })
    }
  },
  component: CreateRecord,
})

function CreateRecord() {
  const { accessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery<Course[], undefined>({
    initialData: [],
    queryFn: apiClient.courses.all,
    queryParams: undefined,
  })
  const { error, isLoading, mutate } = useMutation<RecordItem, RecordMutationParams>({
    mutationFn: apiClient.records.create,
    onSuccess: () => {
      void navigate({ to: '/records' })
    },
  })

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const courseId = String(formData.get('course_id'))

    if (accessToken && courseId) {
      void mutate({ accessToken, courseId })
    }
  }

  return (
    <main className="container narrow">
      <h1>Новая заявка</h1>
      {coursesError && <p className="error">Ошибка: {coursesError.message}</p>}
      {error && <p className="error">Ошибка: {error.message}</p>}
      {coursesLoading ? (
        <p aria-busy="true">Загрузка курсов...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Курс
            <select name="course_id" required defaultValue="">
              <option value="" disabled>Выберите курс</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Создаём...' : 'Создать заявку'}
          </button>
        </form>
      )}
      <Link to="/records">Назад к заявкам</Link>
    </main>
  )
}
