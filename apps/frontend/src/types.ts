export type RecordItem = {
    id: string
    course: {
        id: string,
        title: string
    }
    author: {
        username: string,
        role: 'user' | 'admin'
    }
    created_at: string
}

export type Course = { id: string; title: string }
export type RecordCreateParams = { accessToken: string; course_id: string }
export type RecordDeleteParams = { accessToken: string; id: string }
export type RegisterParams = { username: string; password: string }

export type RecordsAll = {
    data: RecordItem[],
    data_count: number
}

export type RecordQueryParams = {
    accessToken: string | null;
    authorId: string | null;
}

export type UserSearch = {
    username?: string
}

export type LoginResultData = {
    access_token: string;
    token_type: "bearer";
}

export type GetMeResultData = {
    username: string,
    role: "user" | "admin"
}

export type LoginMutationParams = {
    username: string;
    password: string;
}
