import { useState } from 'react'

type UseMutation<ResultData, MutationParams> = {
  mutationFn: (params: MutationParams) => Promise<ResultData>
  onSuccess?: (data: ResultData) => void
}

export default function useMutation<ResultData, MutationParams>({
  mutationFn,
  onSuccess,
}: UseMutation<ResultData, MutationParams>) {
  const [data, setData] = useState<ResultData | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (params: MutationParams) => {
    setLoading(true)
    setError(null)

    try {
      const result = await mutationFn(params)
      setData(result)
      onSuccess?.(result)
    } catch (error: unknown) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return { data, isLoading, error, mutate }
}
