import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useQuery from '#/hooks/use-query'
import type { Course } from '#/types'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.accessToken) {
      throw redirect({ to: '/records' })
    }
  },
  component: Home,
})

function Home() {
  const { data: courses, isLoading, error } = useQuery<Course[], undefined>({
    initialData: [],
    queryFn: apiClient.courses.all,
    queryParams: undefined,
  })

  return (
    <main className="container">
      <nav>
        <strong>Курсы и заявки</strong>
        <span>
          <Link to="/login">Войти</Link>
          {' '}
          <Link to="/register">Регистрация</Link>
        </span>
      </nav>

      <section>
        <h1>Курсы</h1>
        <p>Посмотрите доступные курсы и количество заявок на них.</p>
        {isLoading && <p aria-busy="true">Загрузка...</p>}
        {error && <p className="error">Ошибка: {error.message}</p>}
        {!isLoading && !error && (
          <div className="course-list">
            {courses.map(course => (
              <article key={course.id}>
                <h3>{course.title}</h3>
                <p>Заявок: {course.records_count ?? 0}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Хотите оставить заявку?</h2>
        <p>
          <Link to="/login">Войдите</Link> или{' '}
          <Link to="/register">зарегистрируйтесь</Link>.
        </p>
      </section>
    </main>
  )
}
