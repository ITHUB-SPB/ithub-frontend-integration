const baseUrl = 'http://127.0.0.1:8000'

type ContentType = "x-www-form-urlencoded" | "json"

type Headers = {
    Authorization?: `Bearer ${string}`;
    "Content-Type"?: `application/${ContentType}`;
}

type SearchParams = Record<string, string | number>

type FetcherOptions = {
    path: `/${string}`;
    headers: Headers;
    method: 'get' | 'post';
    body?: string | URLSearchParams;
    searchParams?: SearchParams
}

export default async ({ path, headers, method, body, searchParams = {} }: FetcherOptions) => {
    try {
        const url = new URL(path, baseUrl)

        for (const [param, value] of Object.entries(searchParams)) {
            url.searchParams.append(param, String(value))
        }

        const requestInit = {
            credentials: 'include',
            method,
            headers
        } as RequestInit

        if (body) {
            Object.assign(requestInit, { body })
        }

       const response = await fetch(url.toString(), requestInit)

       if (!response.ok) {
            let errorMessage = 'Сетевая ошибка'
            try {
                const errorData = await response.json()
                if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail
                } else if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail.map((err: any) => err.msg).join(', ')
                } else {
                    errorMessage = JSON.stringify(errorData)
                }
            } catch {
                errorMessage = response.statusText || 'Сетевая ошибка'
            }
            throw new Error(errorMessage)
        }

        return await response.json()

        return await response.json()
    } catch (error) {
        console.error(error)
        throw error
    }
}