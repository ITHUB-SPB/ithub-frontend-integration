import { useState, useEffect } from "react";

type UseQuery<ResultData, QueryParams> = {
    initialData: ResultData;
    queryFn: (props: QueryParams) => Promise<ResultData>;
    queryParams: QueryParams;
};

export default function useQuery<ResultData, QueryParams>({
    initialData,
    queryFn,
    queryParams,
}: UseQuery<ResultData, QueryParams>) {
    const [data, setData] = useState<ResultData>(initialData);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await queryFn(queryParams);

                if (!cancelled) {
                    setData(result);
                }
            } catch (error: unknown) {
                if (!cancelled) {
                    setError(error as Error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    return { data, isLoading, error };
}