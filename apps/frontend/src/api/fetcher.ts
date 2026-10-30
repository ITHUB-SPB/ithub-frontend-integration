const baseUrl = "http://127.0.0.1:8000";

type ContentType = "x-www-form-urlencoded" | "json";

type Headers = {
    Authorization?: `Bearer ${string}`;
    "Content-Type"?: `application/${ContentType}`;
};

type SearchParams = Record<string, string | number>;

type FetcherOptions = {
    path: `/${string}`;
    headers: Headers;
    method: "get" | "post" | "delete";
    body?: string | URLSearchParams;
    searchParams?: SearchParams;
};

export default async ({
    path,
    headers,
    method,
    body,
    searchParams = {},
}: FetcherOptions) => {
    try {
        const url = new URL(path, baseUrl);

        for (const [param, value] of Object.entries(searchParams)) {
            url.searchParams.append(param, String(value));
        }

        const requestInit = {
            credentials: "include",
            method,
            headers,
        } as RequestInit;

        if (body) {
            Object.assign(requestInit, { body });
        }

        const response = await fetch(url.toString(), requestInit);

        if (!response.ok) {
            throw new Error("Сетевая ошибка");
        }

        if (response.status === 204) {
            return null;
        }

        const text = await response.text();

        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};