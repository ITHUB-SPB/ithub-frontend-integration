import type { ComponentProps } from "react";

import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import apiClient from "#/api/client";
import useMutation from "#/hooks/use-mutation";

import type { RegisterMutationParams, RegisterResultData } from "#/types";

export const Route = createFileRoute("/register")({
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
    component: Register,
});

function Register() {
    const navigate = Route.useNavigate();

    const { error, isLoading, mutate } = useMutation<
        RegisterResultData,
        RegisterMutationParams
    >({
        mutationFn: apiClient.auth.register,
        onSuccess: () => {
            void navigate({
                to: "/login",
                search: {
                    registered: true,
                },
            });
        },
    });

    const handleSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const username = String(formData.get("username") ?? "");
        const password = String(formData.get("password") ?? "");

        void mutate({ username, password });
    };

    return (
        <main>
            <h1>Регистрация</h1>

            <form onSubmit={handleSubmit}>
                {error && <p role="alert">Ошибка: {error.message}</p>}

                <label>
                    Логин
                    <input type="text" name="username" minLength={2} required />
                </label>

                <label>
                    Пароль
                    <input
                        type="password"
                        name="password"
                        minLength={6}
                        required
                    />
                </label>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </button>

                <Link to="/login">Уже зарегистрированы?</Link>
            </form>
        </main>
    );
}
