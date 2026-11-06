import { useState, useEffect, useCallback } from "react";

type UseQuery<ResultData, QueryParams> = {
    initialData: ResultData;
    queryFn: (params: QueryParams) => Promise<ResultData>;
    queryParams: QueryParams;
};

export default function useQuery<ResultData, QueryParams>({
    initialData,
    queryFn,
    queryParams,
}: UseQuery<ResultData, QueryParams>) {
    const [data, setData] = useState<ResultData>(initialData);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await queryFn(queryParams);
            setData(result);
            return result;
        } catch (error: unknown) {
            const queryError =
                error instanceof Error
                    ? error
                    : new Error("Неизвестная ошибка");

            setError(queryError);
            return null;
        } finally {
            setLoading(false);
        }
    }, [queryFn, queryParams]);

    useEffect(() => {
        void load();
    }, [load]);

    return {
        data,
        isLoading,
        error,
        refetch: load,
    };
}
