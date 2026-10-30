import { useState } from "react"

type UseMutation<ResultData, MutationParams> = {
    mutationFn: (props: MutationParams) => Promise<{ ResultData }>;
    onSuccess?: (params: ResultData) => void;
}

export default function useMutation<ResultData, MutationParams>({
    mutationFn,
    onSuccess = () => { }
}: UseMutation<ResultData, MutationParams>) {
    const [data, setData] = useState<ResultData | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const mutate = async (mutationParams: MutationParams) => {
        setLoading(true)
        setError(null)

        try {
            const result = await mutationFn(mutationParams)
            setData(result)
            onSuccess(result)
        } catch (error: unknown) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    return { data, isLoading, error, mutate }
}