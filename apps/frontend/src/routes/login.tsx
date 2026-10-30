import type { SubmitEvent } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import apiClient from "#/api/client";
import useMutation from "#/hooks/use-mutation";

export const Route = createFileRoute("/login")({
    beforeLoad: ({ context }) => {
        if (context.accessToken) {
            throw redirect({ to: "/" });
        }
    },
    component: Login,
});

type LoginMutationParams = {
    username: string;
    password: string;
};

function Login() {
    const { setAccessToken } = Route.useRouteContext();
    const navigate = Route.useNavigate();

    const { data, error, isLoading, mutate } = useMutation<
        { access_token: string },
        LoginMutationParams
    >({
        mutationFn: apiClient.auth.login,
        onSuccess: (result) => {
            setAccessToken(result.access_token);
            navigate({ to: "/" });
        },
    });

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        mutate({ password, username });
    };

    return (
        <>
            <form method="post" onSubmit={handleSubmit}>
                {error ? <p>Ошибка: {error.message}</p> : null}

                <input
                    type="text"
                    name="username"
                    placeholder="Логин"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    required
                />
                <button type="submit">Войти</button>
            </form>

            <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </>
    );
}
