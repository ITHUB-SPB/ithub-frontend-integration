import fetcher from "./fetcher"
import type { RecordsAll, LoginResultData, GetMeResultData } from "#/types"

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

    return fetcher<RecordsAll>({
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
}): Promise<GetMeResultData> => {
    const headers = {
        "Content-Type": "application/json"
    } as const

    if (accessToken) {
        Object.assign(headers, { "Authorization": `Bearer ${accessToken}` })
    }

    return fetcher<GetMeResultData>({
        path: "/auth/me",
        headers,
        method: "get",
    })
}

const loginFn = async ({
    username,
    password
}: { username: string, password: string }): Promise<LoginResultData> => {
    const result = await fetcher<LoginResultData>({
        path: "/auth/login",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            username,
            password
        })
    })

    if (!result.data.access_token) {
        throw new Error('No access token provided')
    }

    return result
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