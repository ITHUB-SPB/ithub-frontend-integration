import fetcher from "./fetcher"

const allRecordsFn = async ({
    accessToken,
    authorId
}: {
    accessToken: string | null,
    authorId: string | null
}) => {
    const headers = {
        "Content-Type": "application/json"
    } as const

    if (accessToken) {
        Object.assign(headers, { "Authorization": `Bearer ${accessToken}` })
    }

    const searchParams = {}

    if (authorId) {
        Object.assign(searchParams, { "author_id": authorId })
    }

    const response = await fetcher({
        path: "/records",
        headers,
        method: "get",
        searchParams
    })

    // Если бэкенд возвращает records/records_count, а схема ждет data/data_count, 
    // приводим ответ к тому, что требует бэкенд-валидация:
    return {
        data: response?.data || response?.records || [],
        data_count: response?.data_count ?? response?.records_count ?? 0,
        // Сохраняем и старые поля на всякий случай, если где-то еще используются:
        records: response?.records || response?.data || [],
        records_count: response?.records_count ?? response?.data_count ?? 0,
    }
}

const createRecordFn = async ({
    accessToken,
    courseId
}: {
    accessToken: string | null,
    courseId: string
}) => {
    const headers = {
        "Content-Type": "application/json"
    } as const

    if (accessToken) {
        Object.assign(headers, { "Authorization": `Bearer ${accessToken}` })
    }

    return fetcher({
        path: "/records",
        headers,
        method: "post",
        body: JSON.stringify({ course_id: courseId })
    })
}

const deleteRecordFn = async ({
    accessToken,
    recordId
}: {
    accessToken: string | null,
    recordId: string
}) => {
    const headers = {
        "Content-Type": "application/json"
    } as const

    if (accessToken) {
        Object.assign(headers, { "Authorization": `Bearer ${accessToken}` })
    }

    return fetcher({
        path: `/records/${recordId}`,
        headers,
        method: "post"
    })
}

const getMeFn = async ({
    accessToken,
}: {
    accessToken: string | null,
}): Promise<{ username: string, role: "user" | "admin" }> => {
    const headers = {
        "Content-Type": "application/json"
    } as const

    if (accessToken) {
        Object.assign(headers, { "Authorization": `Bearer ${accessToken}` })
    }

    return fetcher({
        path: "/auth/me",
        headers,
        method: "get",
    })
}

const loginFn = async ({
    username,
    password
}: { username: string, password: string }): Promise<{ access_token: string }> => {
    try {
        const response = await fetcher({
            path: "/auth/login",
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username,
                password
            })
        });

        // Если fetcher вернул данные напрямую
        const token = response?.access_token || response?.data?.access_token;
        
        if (!token) {
            throw new Error('Неверное имя пользователя или пароль');
        }
        
        return { access_token: token };
    } catch (error: any) {
        // Пробрасываем чистую ошибку, чтобы фронтенд её не ломал на property access
        throw new Error('Неверное имя пользователя или пароль');
    }
}

const registerFn = async ({
    username, 
    password
} : {username: string, password: string}) => {
    return fetcher({
        path: "/auth/",
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password})
    })
}

export default {
    records: {
        all: allRecordsFn,
        create: createRecordFn,
        delete: deleteRecordFn,
    },
    auth: {
        login: loginFn,
        register: registerFn, // registerFn
        me: getMeFn
    }
}