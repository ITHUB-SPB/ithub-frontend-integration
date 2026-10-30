import type { SubmitEvent } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient from "#/api/client";
import useMutation from "#/hooks/use-mutation";

export const Route = createFileRoute("/register")({
    beforeLoad: ({ context }) => {
        if (context.accessToken) {
            throw redirect({ to: "/" });
        }
    },
    component: Register,
});

type RegisterMutationParams = {
    username: string;
    password: string;
};

function Register() {
    const navigate = Route.useNavigate();

    const { error, isLoading, mutate } = useMutation<
        null,
        RegisterMutationParams
    >({
        mutationFn: apiClient.auth.register,
        onSuccess: () => {
            navigate({ to: "/login" });
        },
    });

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        mutate({ username, password });
    };

    return (
        <main>
            <h1>Регистрация</h1>

            {error && <p>Ошибка: {error.message}</p>}

            <form method="post" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Логин"
                    minLength={2}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    minLength={8}
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </button>
            </form>

            <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </main>
    );
}
