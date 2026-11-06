import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useMemo } from "react";

import apiClient from "#/api/client";
import useQuery from "#/hooks/use-query";
import useMutation from "#/hooks/use-mutation";

import type {
    RecordItem,
    RecordsAll,
    DeleteRecordMutationParams,
} from "#/types";

export const Route = createFileRoute("/records/")({
    beforeLoad: async ({ context }) => {
        if (!context.accessToken) {
            throw redirect({ to: "/login" });
        }

        let username: string;

        try {
            const user = await apiClient.auth.me({
                accessToken: context.accessToken,
            });

            username = user.username;
        } catch {
            context.setAccessToken(null);
            throw redirect({ to: "/login" });
        }

        return { username };
    },
    component: Records,
});

function RecordRow({
    record,
    accessToken,
    onDeleted,
}: {
    record: RecordItem;
    accessToken: string;
    onDeleted: () => void;
}) {
    const { error, isLoading, mutate } = useMutation<
        void,
        DeleteRecordMutationParams
    >({
        mutationFn: apiClient.records.delete,
        onSuccess: onDeleted,
    });

    return (
        <tr>
            <td>{record.id}</td>
            <td>{record.course.title}</td>
            <td>{new Date(record.created_at).toLocaleString()}</td>
            <td>
                <Link to="/records/$id" params={{ id: String(record.id) }}>
                    Подробнее
                </Link>
            </td>
            <td>
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                        void mutate({
                            id: record.id,
                            accessToken,
                        });
                    }}
                >
                    {isLoading ? "Удаление..." : "Удалить"}
                </button>

                {error && <p role="alert">{error.message}</p>}
            </td>
        </tr>
    );
}

function Records() {
    const { accessToken, setAccessToken } = Route.useRouteContext();
    const { username } = Route.useRouteContext();
    const navigate = Route.useNavigate();

    const queryParams = useMemo(
        () => ({
            accessToken,
            author: username,
        }),
        [accessToken, username],
    );

    const { data, isLoading, error, refetch } = useQuery<
        RecordsAll,
        typeof queryParams
    >({
        initialData: {
            data: [],
            data_count: 0,
        },
        queryFn: apiClient.records.all,
        queryParams,
    });

    const logout = () => {
        setAccessToken(null);
        void navigate({ to: "/login" });
    };

    return (
        <main>
            <header>
                <h1>Мои заявки</h1>

                <p>Пользователь: {username}</p>

                <button type="button" onClick={logout}>
                    Выйти
                </button>
            </header>

            <nav>
                <Link to="/records/create">Добавить заявку</Link>
            </nav>

            <p>Всего заявок: {data.data_count}</p>

            {isLoading ? (
                <p aria-busy="true">Загрузка заявок...</p>
            ) : error ? (
                <p role="alert">Ошибка: {error.message}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Курс</th>
                            <th>Дата создания</th>
                            <th>Информация</th>
                            <th>Действия</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.data.map((record) => (
                            <RecordRow
                                key={record.id}
                                record={record}
                                accessToken={accessToken!}
                                onDeleted={() => void refetch()}
                            />
                        ))}

                        {!data.data.length && (
                            <tr>
                                <td colSpan={5}>У вас пока нет заявок</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </main>
    );
}
