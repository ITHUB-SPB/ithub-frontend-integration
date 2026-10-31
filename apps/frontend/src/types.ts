export type RecordItem = {
    id: string
    course: {
        id: string,
        title: string
    }
    author: {
        username: string,
        role: 'user'
    }
    created_at: string
}

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
    data: {
        access_token: string;
    };
}

export type GetMeResultData = {
    username: string,
    role: "user" | "admin"
}

export type LoginMutationParams = {
    username: string;
    password: string;
}
