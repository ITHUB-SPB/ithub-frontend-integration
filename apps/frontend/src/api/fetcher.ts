const baseUrl = 'http://127.0.0.1:8000'

type SearchParams = Record<string, string | number | undefined>

type BaseOptions = {
  path: `/${string}`
  headers?: Record<string, string>
  searchParams?: SearchParams
}

type GetOptions = BaseOptions & {
  method: 'get' | 'delete'
  body?: never
}

type JsonPostOptions = BaseOptions & {
  method: 'post'
  headers: Record<string, string> & { 'Content-Type': 'application/json' }
  body: object
}

type FormPostOptions = BaseOptions & {
  method: 'post'
  headers: Record<string, string> & { 'Content-Type': 'application/x-www-form-urlencoded' }
  body: URLSearchParams
}

type FetcherOptions = GetOptions | JsonPostOptions | FormPostOptions

export default async function fetcher<ResultType = void>(
  options: FetcherOptions,
): Promise<ResultType> {
  const { path, searchParams = {}, ...requestOptions } = options
  const url = new URL(path, baseUrl)

  for (const [param, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      url.searchParams.append(param, String(value))
    }
  }

  const requestInit: RequestInit = {
    credentials: 'include',
    method: requestOptions.method,
    headers: requestOptions.headers,
  }

  if ('body' in requestOptions) {
    requestInit.body = requestOptions.body instanceof URLSearchParams
      ? requestOptions.body
      : JSON.stringify(requestOptions.body)
  }

  const response = await fetch(url, requestInit)

  if (!response.ok) {
    let message = `Ошибка ${response.status}`

    try {
      const errorData = await response.json() as { detail?: string | Array<{ msg?: string }> }
      if (typeof errorData.detail === 'string') {
        message = errorData.detail
      } else if (Array.isArray(errorData.detail)) {
        message = errorData.detail.map(error => error.msg).filter(Boolean).join(', ') || message
      }
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as ResultType
  }

  return await response.json() as ResultType
}
