import fetcher from "./fetcher";

export type Course = {
    id: string;
    title: string;
};

export type RecordsListResponse = {
    data: RecordResponse[];
    data_count: number;
};

export type RecordResponse = {
    id: number;
    created_at: string;
    course: Course;
    author: {
        username: string;
        role: "user" | "admin";
    };
};

const allCoursesFn = async (): Promise<Course[]> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    return fetcher({
        path: "/courses/",
        headers,
        method: "get",
    });
};

const allRecordsFn = async ({
    accessToken,
    authorId,
    courseId,
    limit,
}: {
    accessToken?: string | null;
    authorId?: string | null;
    courseId?: string;
    limit?: number;
}): Promise<RecordsListResponse> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const searchParams: Record<string, string> = {};

    if (authorId) {
        searchParams.author = authorId;
    }

    if (courseId) {
        searchParams.course = courseId;
    }

    if (limit !== undefined) {
        searchParams.limit = String(limit);
    }

    return fetcher({
        path: "/records/",
        headers,
        method: "get",
        searchParams,
    });
};

const getMeFn = async ({
    accessToken,
}: {
    accessToken: string | null;
}): Promise<{ username: string; role: "user" | "admin" }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    return fetcher({
        path: "/auth/me",
        headers,
        method: "get",
    });
};

const loginFn = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}): Promise<{ access_token: string }> => {
    return fetcher({
        path: "/auth/login",
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username,
            password,
        }),
    }).then((data) => {
        if (!data.access_token) {
            throw new Error("No access token provided");
        }

        return data;
    });
};

const registerFn = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}) => {
    return fetcher({
        path: "/auth/",
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });
};

const deleteRecordFn = async ({
    accessToken,
    id,
}: {
    accessToken: string;
    id: number;
}): Promise<null> => {
    return fetcher({
        path: `/records/${id}`,
        method: "delete",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export default {
    courses: {
        all: allCoursesFn,
    },
    records: {
        all: allRecordsFn,
        create: null,
        delete: deleteRecordFn,
    },
    auth: {
        login: loginFn,
        register: registerFn,
        me: getMeFn,
    },
};
