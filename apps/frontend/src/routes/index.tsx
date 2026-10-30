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
            <main className="p-8">
                <h1 className="text-4xl font-bold">Доступные курсы</h1>
                <p>Не удалось загрузить информацию о курсах: {error.message}</p>
            </main>
        );
    }

    return (
        <main className="p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold">FastAPI Integration</h1>
                <p className="mt-2">
                    Ознакомьтесь с доступными курсами и подайте заявку на
                    обучение.
                </p>
            </header>

            <section className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Доступные курсы</h2>

                {isLoading ? (
                    <p>Загрузка курсов...</p>
                ) : courses.length === 0 ? (
                    <p>Пока нет доступных курсов.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {courses.map((course) => (
                            <article
                                key={course.id}
                                className="rounded-lg border p-4"
                            >
                                <h3 className="text-xl font-semibold">
                                    {course.title}
                                </h3>

                                <p className="mt-2">
                                    Подано заявок: {course.recordsCount}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="rounded-lg border p-6">
                <h2 className="text-2xl font-bold">Хотите подать заявку?</h2>

                <p className="mt-2">
                    Войдите в существующий аккаунт или зарегистрируйтесь, чтобы
                    продолжить.
                </p>

                <div className="mt-4 flex flex-wrap gap-4">
                    <Link to="/login" className="rounded-md border px-4 py-2">
                        Войти
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-md border px-4 py-2"
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            </section>
        </main>
    );
}
