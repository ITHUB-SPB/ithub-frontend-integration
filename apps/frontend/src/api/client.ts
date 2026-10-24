import fetcher from "./fetcher"

const allRecordsFn = async ({
    accessToken,
    authorId
}: {
    accessToken: string | null,
    authorId?: string
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

    return fetcher({
        path: "/records",
        headers,
        method: "get",
        searchParams
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
    return fetcher({
        path: "/auth/login",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            username,
            password
        })
    }).then(data => {
        if (!data.access_token) {
            throw new Error('No access token provided')
        }
        return data
    })
}

export default {
    records: {
        all: allRecordsFn,
        create: null,
        delete: null,
    },
    auth: {
        login: loginFn,
        register: null,
        me: getMeFn
    }
}