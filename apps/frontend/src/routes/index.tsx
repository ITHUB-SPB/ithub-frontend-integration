import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient, { type Course } from "#/api/client";
import useQuery from "#/hooks/use-query";

type CourseWithRecordsCount = Course & {
    recordsCount: number;
};

const getCoursesWithRecordsCount = async (
    _params: undefined,
): Promise<CourseWithRecordsCount[]> => {
    const courses = await apiClient.courses.all();

    return Promise.all(
        courses.map(async (course) => {
            const records = await apiClient.records.all({
                courseId: course.id,
                limit: 1,
            });

            return {
                ...course,
                recordsCount: records.data_count,
            };
        }),
    );
};

export const Route = createFileRoute("/")({
    beforeLoad: ({ context }) => {
        if (context.accessToken) {
            throw redirect({ to: "/records" });
        }
    },
    component: Home,
});

function Home() {
    const {
        data: courses,
        isLoading,
        error,
    } = useQuery<CourseWithRecordsCount[], undefined>({
        initialData: [],
        queryFn: getCoursesWithRecordsCount,
        queryParams: undefined,
    });

    if (error) {
        return (
            <main>
                <h1>Доступные курсы</h1>
                <p>Не удалось загрузить информацию о курсах: {error.message}</p>
            </main>
        );
    }

    return (
        <main>
            <header>
                <h1>FastAPI Integration</h1>
                <p>
                    Ознакомьтесь с доступными курсами и подайте заявку на
                    обучение.
                </p>
            </header>

            <section>
                <h2>Доступные курсы</h2>

                {isLoading ? (
                    <p>Загрузка курсов...</p>
                ) : courses.length === 0 ? (
                    <p>Пока нет доступных курсов.</p>
                ) : (
                    <div>
                        {courses.map((course) => (
                            <article key={course.id}>
                                <h3>{course.title}</h3>

                                <p>Подано заявок: {course.recordsCount}</p>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2>Хотите подать заявку?</h2>

                <p>
                    Войдите в существующий аккаунт или зарегистрируйтесь, чтобы
                    продолжить.
                </p>

                <div>
                    <Link to="/login">Войти</Link>

                    <Link to="/register">Зарегистрироваться</Link>
                </div>
            </section>
        </main>
    );
}
