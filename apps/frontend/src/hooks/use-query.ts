import { useCallback, useEffect, useState } from 'react'

type UseQuery<ResultData, QueryParams> = {
  initialData: ResultData
  queryFn: (params: QueryParams) => Promise<ResultData>
  queryParams: QueryParams
  enabled?: boolean
}

export default function useQuery<ResultData, QueryParams>({
  initialData,
  queryFn,
  queryParams,
  enabled = true,
}: UseQuery<ResultData, QueryParams>) {
  const [data, setData] = useState<ResultData>(initialData)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const paramsKey = JSON.stringify(queryParams)

  const load = useCallback(async () => {
    if (!enabled) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      setData(await queryFn(queryParams))
    } catch (error: unknown) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [enabled, paramsKey, queryFn])

  useEffect(() => {
    void load()
  }, [load])

  return { data, isLoading, error, refetch: load }
}
