import fetcher from "./fetcher";

import type {
    Course,
    RecordsAll,
    RecordItem,
    LoginResultData,
    GetMeResultData,
    RegisterResultData,
    LoginMutationParams,
    RegisterMutationParams,
    RecordQueryParams,
    CreateRecordMutationParams,
    DeleteRecordMutationParams,
} from "#/types";

const authHeaders = (accessToken?: string | null) => ({
    "Content-Type": "application/json",
    ...(accessToken
        ? { Authorization: `Bearer ${accessToken}` as `Bearer ${string}` }
        : {}),
});

const recordsAllFn = ({ accessToken, author }: RecordQueryParams = {}) => {
    return fetcher<RecordsAll>({
        path: "/records",
        method: "get",
        headers: authHeaders(accessToken),
        searchParams: author ? { author } : {},
    });
};

const recordGetFn = ({
    id,
    accessToken,
}: {
    id: number;
    accessToken?: string | null;
}) => {
    return fetcher<RecordItem>({
        path: `/records/${id}`,
        method: "get",
        headers: authHeaders(accessToken),
    });
};

const recordCreateFn = ({
    course_id,
    accessToken,
}: CreateRecordMutationParams) => {
    return fetcher<RecordItem>({
        path: "/records",
        method: "post",
        headers: authHeaders(accessToken),
        body: JSON.stringify({ course_id }),
    });
};

const recordDeleteFn = ({ id, accessToken }: DeleteRecordMutationParams) => {
    return fetcher<void>({
        path: `/records/${id}`,
        method: "delete",
        headers: authHeaders(accessToken),
    });
};

const coursesAllFn = () => {
    return fetcher<Course[]>({
        path: "/courses",
        method: "get",
    });
};

const getMeFn = ({ accessToken }: { accessToken: string }) => {
    return fetcher<GetMeResultData>({
        path: "/auth/me",
        method: "get",
        headers: authHeaders(accessToken),
    });
};

const loginFn = ({ username, password }: LoginMutationParams) => {
    return fetcher<LoginResultData>({
        path: "/auth/login",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }),
    });
};

const registerFn = ({ username, password }: RegisterMutationParams) => {
    return fetcher<RegisterResultData>({
        path: "/auth",
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
};

export default {
    auth: {
        login: loginFn,
        register: registerFn,
        me: getMeFn,
    },
    courses: {
        all: coursesAllFn,
    },
    records: {
        all: recordsAllFn,
        get: recordGetFn,
        create: recordCreateFn,
        delete: recordDeleteFn,
    },
};
