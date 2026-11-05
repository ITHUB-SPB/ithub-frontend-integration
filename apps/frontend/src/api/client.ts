import fetcher from "./fetcher"
import type { RecordsAll, LoginResultData, GetMeResultData, RegisterParams, RecordCreateParams, RecordDeleteParams, Course } from "#/types"

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
        Object.assign(searchParams, { "author": authorId })
    }

    return fetcher<RecordsAll>({
        path: "/records",
        headers,
        method: "get",
        searchParams
    })
}

const registerFn = ({ username, password }: RegisterParams) => fetcher<void>({
    path: "/auth/", method: "post", headers: { "Content-Type": "application/json" }, body: { username, password }
})

const coursesFn = () => fetcher<Course[]>({ path: "/courses/", method: "get" })

const summaryFn = () => fetcher<Record<string, number>>({ path: "/records/summary", method: "get" })

const createRecordFn = ({ accessToken, course_id }: RecordCreateParams) => fetcher({
    path: "/records/", method: "post", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` }, body: { course_id }
})

const deleteRecordFn = ({ accessToken, id }: RecordDeleteParams) => fetcher<void>({
    path: `/records/${id}`, method: "delete", headers: { "Authorization": `Bearer ${accessToken}` }
})

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
}: { username: string, password: string }): Promise<{ data: LoginResultData }> => {
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

    if (!result.access_token) {
        throw new Error('No access token provided')
    }

    return { data: result }
}

export default {
    records: {
        all: allRecordsFn,
        create: createRecordFn,
        delete: deleteRecordFn,
    },
    auth: {
        login: loginFn,
        register: registerFn,
        me: getMeFn,
        courses: coursesFn,
        summary: summaryFn
    }
}
