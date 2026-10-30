import { useEffect } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient from "#/api/client";
import useQuery from "#/hooks/use-query";
import useMutation from "#/hooks/use-mutation";

type RecordsQueryParams = {
    accessToken: string;
    authorId: string;
};

type DeleteRecordParams = {
    accessToken: string;
    id: number;
};

const getRecords = async ({ accessToken, authorId }: RecordsQueryParams) => {
    const result = await apiClient.records.all({
        accessToken,
        authorId,
    });

    return result.data;
};

export const Route = createFileRoute("/records/")({
    beforeLoad: async ({ context }) => {
        if (!context.accessToken) {
            throw redirect({ to: "/login" });
        }

        if (!context.username) {
            try {
                const user = await apiClient.auth.me({
                    accessToken: context.accessToken,
                });

                return { username: user.username };
            } catch {
                context.setAccessToken(null);
                throw redirect({ to: "/login" });
            }
        }
    },
    component: Records,
});

function Records() {
    const { accessToken, username, setAccessToken } = Route.useRouteContext();

    const navigate = Route.useNavigate();

    const {
        data: records,
        isLoading,
        error,
        refetch,
    } = useQuery({
        initialData: [],
        queryFn: getRecords,
        queryParams: {
            accessToken: accessToken!,
            authorId: username!,
        },
    });

    const {
        error: deleteError,
        isLoading: isDeleting,
        mutate: deleteRecord,
    } = useMutation<null, DeleteRecordParams>({
        mutationFn: apiClient.records.delete,
        onSuccess: () => {
            refetch();
        },
    });

    useEffect(() => {
        if (!accessToken) {
            navigate({ to: "/login" });
        }
    }, [accessToken, navigate]);

    const handleLogout = () => {
        setAccessToken(null);
        navigate({ to: "/login" });
    };

    const handleDelete = (id: number) => {
        if (!window.confirm("Вы действительно хотите удалить заявку?")) {
            return;
        }

        if (accessToken) {
            deleteRecord({
                accessToken,
                id,
            });
        }
    };

    if (error) {
        return (
            <main>
                <h1>Мои заявки</h1>
                <p>Ошибка загрузки: {error.message}</p>
            </main>
        );
    }

    return (
        <main>
            <header>
                <div>
                    <h1>Мои заявки</h1>
                    <p>Пользователь: {username}</p>

                    <Link to="/records/create">Добавить заявку</Link>
                </div>

                <button type="button" onClick={handleLogout}>
                    Выйти
                </button>
            </header>

            <section>
                <h2>Список заявок</h2>

                {isLoading ? (
                    <p>Загрузка заявок...</p>
                ) : records.length === 0 ? (
                    <p>У вас пока нет заявок.</p>
                ) : (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Курс</th>
                                    <th>Дата создания</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>

                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.id}</td>

                                        <td>{record.course.title}</td>

                                        <td>
                                            {new Date(
                                                record.created_at,
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={() =>
                                                    handleDelete(record.id)
                                                }
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {deleteError && <p>Ошибка удаления: {deleteError.message}</p>}
            </section>
        </main>
    );
}
