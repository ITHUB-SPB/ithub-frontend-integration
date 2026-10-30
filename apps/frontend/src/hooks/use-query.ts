import { useState, useEffect } from "react"

type UseQuery<ResultData, QueryParams> = {
    initialData: ResultData;
    queryFn: (props: QueryParams) => Promise<{ data: ResultData }>;
    queryParams: QueryParams
}

export default function useQuery<ResultData, QueryParams>({
    initialData,
    queryFn,
    queryParams
}: UseQuery<ResultData, QueryParams>) {
    const [data, setData] = useState<ResultData>(initialData)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await queryFn(queryParams)
            setData(result.data)
        } catch (error: unknown) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    return { data, isLoading, error }
}