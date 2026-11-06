const baseUrl = "http://127.0.0.1:8000";

type Headers = {
    Authorization?: `Bearer ${string}`;
    "Content-Type"?: string;
};

type SearchParams = Record<string, string | number>;

type FetcherOptions = {
    path: `/${string}`;
    headers?: Headers;
    method: "get" | "post" | "delete";
    body?: string | URLSearchParams;
    searchParams?: SearchParams;
};

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export default async function fetcher<ResultType = void>({
    path,
    headers = {},
    method,
    body,
    searchParams = {},
}: FetcherOptions): Promise<ResultType> {
    const url = new URL(path, baseUrl);

    for (const [param, value] of Object.entries(searchParams)) {
        url.searchParams.append(param, String(value));
    }

    try {
        const response = await fetch(url.toString(), {
            method,
            headers,
            body,
            credentials: "include",
        });

        if (!response.ok) {
            let message = "Произошла ошибка при выполнении запроса";

            try {
                const errorData = await response.json();
                message = errorData.detail ?? message;
            } catch {
                // Ответ не содержит JSON
            }

            throw new ApiError(message, response.status);
        }

        if (response.status === 204) {
            return undefined as ResultType;
        }

        return (await response.json()) as ResultType;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof Error && error.name === "TypeError") {
            throw new Error("Не удалось подключиться к серверу");
        }

        throw error;
    }
}
