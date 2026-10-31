import type { SubmitEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import apiClient from '#/api/client'
import useMutation from '#/hooks/use-mutation'
import * as types from '#/types'

export const Route = createFileRoute('/login')({
  component: Login,
})


function Login() {
  const { setAccessToken } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const { error, isLoading, mutate } = useMutation<types.LoginResultData, types.LoginMutationParams>({
    mutationFn: apiClient.auth.login,
    onSuccess: (result) => {
      setAccessToken(result.data.access_token)
      navigate({ to: '/' })
    }
  })

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    mutate({ password, username })
  }

  return isLoading ? <p>Загрузка...</p> : (
    <form method='post' onSubmit={handleSubmit}>
      {error ? <p>Ошибка: {error.message}</p> : null}

      <input type="text" name="username" placeholder='Логин' required />
      <input type="password" name="password" placeholder='Пароль' required />
      <button type="submit">Войти</button>
    </form>
  )
}
