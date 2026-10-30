import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient, { type Course, type RecordResponse } from "#/api/client";
import useQuery from "#/hooks/use-query";
import useMutation from "#/hooks/use-mutation";

type CreateRecordParams = {
    accessToken: string;
    courseId: string;
};

export const Route = createFileRoute("/records/create")({
    beforeLoad: ({ context }) => {
        if (!context.accessToken) {
            throw redirect({ to: "/login" });
        }
    },
    component: CreateRecord,
});

function CreateRecord() {
    const { accessToken } = Route.useRouteContext();
    const navigate = Route.useNavigate();

    const [courseId, setCourseId] = useState("");

    const {
        data: courses,
        isLoading: isCoursesLoading,
        error: coursesError,
    } = useQuery<Course[], Record<string, never>>({
        initialData: [],
        queryFn: apiClient.courses.all,
        queryParams: {},
    });

    const {
        isLoading: isCreating,
        error: createError,
        mutate: createRecord,
    } = useMutation<RecordResponse, CreateRecordParams>({
        mutationFn: apiClient.records.create,
        onSuccess: () => {
            navigate({ to: "/records" });
        },
    });

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        if (!courseId || !accessToken) {
            return;
        }

        createRecord({
            accessToken,
            courseId,
        });
    };

    return (
        <main>
            <h1>Создание заявки</h1>

            <Link to="/records">Назад к заявкам</Link>

            {isCoursesLoading && <p>Загрузка курсов...</p>}

            {coursesError && <p>Не удалось загрузить список курсов.</p>}

            {!isCoursesLoading && !coursesError && (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="course">Выберите курс</label>

                    <select
                        id="course"
                        value={courseId}
                        onChange={(event) => setCourseId(event.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Выберите курс
                        </option>

                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>

                    {createError && (
                        <p role="alert">
                            {createError.message.includes("409")
                                ? "Вы уже подавали заявку на этот курс."
                                : createError.message ||
                                  "Не удалось создать заявку."}
                        </p>
                    )}

                    <button type="submit" disabled={!courseId || isCreating}>
                        {isCreating ? "Создание..." : "Создать заявку"}
                    </button>
                </form>
            )}
        </main>
    );
}
