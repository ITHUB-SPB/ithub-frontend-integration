import { useMemo } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient from "#/api/client";
import useQuery from "#/hooks/use-query";

import type { RecordItem } from "#/types";

export const Route = createFileRoute("/records/$id")({
    beforeLoad: async ({ context }) => {
        if (!context.accessToken) {
            throw redirect({ to: "/login" });
        }

        try {
            const user = await apiClient.auth.me({
                accessToken: context.accessToken,
            });

            return { username: user.username };
        } catch {
            context.setAccessToken(null);
            throw redirect({ to: "/login" });
        }
    },
    component: RecordDetails,
});

function RecordDetails() {
    const { id } = Route.useParams();
    const { accessToken } = Route.useRouteContext();

    const recordId = Number(id);

    const queryParams = useMemo(
        () => ({
            id: recordId,
            accessToken,
        }),
        [recordId, accessToken],
    );

    const {
        data: record,
        isLoading,
        error,
    } = useQuery<RecordItem | null, typeof queryParams>({
        initialData: null,
        queryFn: apiClient.records.get,
        queryParams,
    });

    return (
        <main>
            <h1>Информация о заявке</h1>

            {isLoading ? (
                <p aria-busy="true">Загрузка...</p>
            ) : error ? (
                <p role="alert">Ошибка: {error.message}</p>
            ) : record ? (
                <article>
                    <header>Заявка № {record.id}</header>

                    <p>Курс: {record.course.title}</p>

                    <p>Автор: {record.author.username}</p>

                    <p>
                        Дата создания:{" "}
                        {new Date(record.created_at).toLocaleString()}
                    </p>
                </article>
            ) : null}

            <Link to="/records">Все заявки</Link>
        </main>
    );
}
