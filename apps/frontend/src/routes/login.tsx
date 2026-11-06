import type { ComponentProps } from "react";

import {
    createFileRoute,
    Link,
    redirect,
    useNavigate,
} from "@tanstack/react-router";

import apiClient from "#/api/client";
import useMutation from "#/hooks/use-mutation";

import type { LoginMutationParams } from "#/types";

export const Route = createFileRoute("/login")({
    validateSearch: (
        search: Record<string, unknown>,
    ): { registered?: boolean } => {
        return search.registered === true ? { registered: true } : {};
    },
    beforeLoad: async ({ context }) => {
        if (!context.accessToken) return;

        let authenticated = false;

        try {
            await apiClient.auth.me({ accessToken: context.accessToken });
            authenticated = true;
        } catch {
            context.setAccessToken(null);
        }

        if (authenticated) {
            throw redirect({ to: "/records" });
        }
    },
    component: Login,
});

function Login() {
    const { setAccessToken } = Route.useRouteContext();
    const navigate = useNavigate();

    const { mutate, isLoading, error } = useMutation<
        { access_token: string; token_type: string },
        LoginMutationParams
    >({
        mutationFn: apiClient.auth.login,
        onSuccess: (result) => {
            setAccessToken(result.access_token);
            void navigate({ to: "/records" });
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
        <main className="container">
            <h1>Вход</h1>

            {Route.useSearch().registered && (
                <p>Регистрация прошла успешно! Теперь войдите в аккаунт.</p>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Имя пользователя
                    <input
                        type="text"
                        name="username"
                        placeholder="Имя пользователя"
                        required
                    />
                </label>

                <label>
                    Пароль
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        required
                    />
                </label>

                {error && <p role="alert">{error.message}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Вход..." : "Войти"}
                </button>
            </form>

            <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </main>
    );
}
