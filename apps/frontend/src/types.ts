export type Course = {
    id: string
    title: string
}

export type RecordItem = {
    id: number
    course: Course
    author: {
        username: string,
        role: 'user' | 'admin'
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
    courseId?: string | null;
}

export type RecordCreateParams = {
    accessToken: string | null;
    data: {
        course_id: string;
    };
}

export type RecordDeleteParams = {
    accessToken: string | null;
    recordId: number;
}

export type UserSearch = {
    username?: string
}

// Бэкенд отдаёт токен напрямую: {"access_token": "...", "token_type": "bearer"}
export type LoginResultData = {
    access_token: string;
    token_type: 'bearer';
}

export type GetMeResultData = {
    username: string,
    role: "user" | "admin"
}

export type LoginMutationParams = {
    username: string;
    password: string;
}

export type RegisterMutationParams = {
    username: string;
    password: string;
}
