import type { ComponentProps } from "react";
import { useMemo } from "react";

import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient from "#/api/client";
import useQuery from "#/hooks/use-query";
import useMutation from "#/hooks/use-mutation";

import type { Course, RecordItem, CreateRecordMutationParams } from "#/types";

export const Route = createFileRoute("/records/create")({
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
    component: CreateRecord,
});

function CreateRecord() {
    const { accessToken, username } = Route.useRouteContext();
    const navigate = Route.useNavigate();

    const emptyParams = useMemo(() => ({}), []);

    const {
        data: courses,
        isLoading: coursesLoading,
        error: coursesError,
    } = useQuery<Course[], typeof emptyParams>({
        initialData: [],
        queryFn: apiClient.courses.all,
        queryParams: emptyParams,
    });

    const { error, isLoading, mutate } = useMutation<
        RecordItem,
        CreateRecordMutationParams
    >({
        mutationFn: apiClient.records.create,
        onSuccess: () => {
            void navigate({ to: "/records" });
        },
    });

    const handleSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const courseId = String(formData.get("course_id") ?? "");

        if (!courseId) {
            return;
        }

        void mutate({
            course_id: courseId,
            accessToken: accessToken!,
        });
    };

    if (coursesLoading) {
        return <p aria-busy="true">Загрузка курсов...</p>;
    }

    if (coursesError) {
        return (
            <main>
                <h1>Создание заявки</h1>
                <p role="alert">
                    Ошибка загрузки курсов: {coursesError.message}
                </p>
                <Link to="/records">Назад</Link>
            </main>
        );
    }

    return (
        <main>
            <h1>Создание заявки</h1>

            <p>Пользователь: {username}</p>

            {error && <p role="alert">Ошибка: {error.message}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Выберите курс
                    <select name="course_id" required defaultValue="">
                        <option value="" disabled>
                            Выберите курс
                        </option>

                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit" disabled={isLoading || !courses.length}>
                    {isLoading ? "Создание..." : "Создать заявку"}
                </button>
            </form>

            <Link to="/records">Вернуться к заявкам</Link>
        </main>
    );
}
