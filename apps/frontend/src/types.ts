export type Course = {
    id: string;
    title: string;
};

export type User = {
    username: string;
    role: "user" | "admin";
};

export type RecordItem = {
    id: number;
    course: Course;
    author: User;
    created_at: string;
};

export type RecordsAll = {
    data: RecordItem[];
    data_count: number;
};

export type LoginResultData = {
    access_token: string;
    token_type: "bearer";
};

export type GetMeResultData = User;

export type RegisterResultData = boolean;

export type RecordCreateData = {
    course_id: string;
};

export type RecordQueryParams = {
    accessToken?: string | null;
    author?: string | null;
};

export type LoginMutationParams = {
    username: string;
    password: string;
};

export type RegisterMutationParams = LoginMutationParams;

export type CreateRecordMutationParams = {
    course_id: string;
    accessToken: string;
};

export type DeleteRecordMutationParams = {
    id: number;
    accessToken: string;
};
