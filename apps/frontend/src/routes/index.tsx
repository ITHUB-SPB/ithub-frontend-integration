import { useMemo } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient from "#/api/client";
import useQuery from "#/hooks/use-query";

import type { Course, RecordsAll } from "#/types";

export const Route = createFileRoute("/")({
    beforeLoad: async ({ context }) => {
        if (context.accessToken) {
            try {
                await apiClient.auth.me({
                    accessToken: context.accessToken,
                });

                throw redirect({ to: "/records" });
            } catch (error) {
                if (error instanceof Response) {
                    throw error;
                }

                context.setAccessToken(null);
            }
        }
    },
    component: Home,
});

function Home() {
    const coursesQuery = useQuery<Course[], void>({
        initialData: [],
        queryFn: apiClient.courses.all,
        queryParams: undefined,
    });

    const emptyParams = useMemo(() => ({}), []);

    const recordsQuery = useQuery<RecordsAll, typeof emptyParams>({
        initialData: {
            data: [],
            data_count: 0,
        },
        queryFn: apiClient.records.all,
        queryParams: emptyParams,
    });

    const courseCounts = useMemo(() => {
        return coursesQuery.data.map((course) => ({
            ...course,
            count: recordsQuery.data.data.filter(
                (record) => record.course.id === course.id,
            ).length,
        }));
    }, [coursesQuery.data, recordsQuery.data]);

    const isLoading = coursesQuery.isLoading || recordsQuery.isLoading;
    const error = coursesQuery.error || recordsQuery.error;

    return (
        <div className="p-8">
            <nav>
                <Link to="/login">Войти</Link>
                {" | "}
                <Link to="/register">Зарегистрироваться</Link>
            </nav>

            <h1 className="text-4xl font-bold">FastAPI Integration</h1>

            {/* <input
        className="border"
        type="text"
        name="search"
        placeholder='Поиск...'
        value={search ?? ""}
        onChange={e => setSearch(e.target.value)}
      /> */}

            {isLoading ? (
                <p aria-busy="true">Загрузка курсов...</p>
            ) : error ? (
                <p role="alert">Ошибка: {error.message}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Курс</th>
                            <th>Количество заявок</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseCounts.map((course) => (
                            <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.count}</td>
                            </tr>
                        ))}

                        {!courseCounts.length && (
                            <tr>
                                <td colSpan={2}>Курсов пока нет</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
