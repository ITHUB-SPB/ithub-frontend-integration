import type { SubmitEvent } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import apiClient from "#/api/client";
import useMutation from "#/hooks/use-mutation";
import * as types from "#/types";

export const Route = createFileRoute("/register")({
    component: Register,
    beforeLoad: ({ context }) => {
        if (context.accessToken) {
            throw redirect({ to: "/" });
        }
    },
});

function Register() {
    const navigate = Route.useNavigate();

    const { error, isLoading, mutate } = useMutation<
        null,
        types.RegisterMutationParams
    >({
        mutationFn: apiClient.auth.register,
        onSuccess: () => {
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

    return isLoading ? (
        <p>Загрузка...</p>
    ) : (
        <form method="post" onSubmit={handleSubmit}>
            {error ? <p>Ошибка: {error.message}</p> : null}

            <input type="text" name="username" placeholder="Логин" required />
            <input
                type="password"
                name="password"
                placeholder="Пароль"
                required
            />
            <button type="submit">Зарегистрироваться</button>

            <a href="/login">Уже зарегистрирован</a>
        </form>
    );
}
