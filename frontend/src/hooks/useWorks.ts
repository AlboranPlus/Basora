import { useQuery } from '@tanstack/react-query'
import { worksApi } from '@/api/works'

export const useWorks = (params: { q?: string; subject?: string; page?: number }) =>
  useQuery({
    queryKey: ['works', params],
    queryFn: () => worksApi.search(params),
  })

export const useWork = (id: string) =>
  useQuery({
    queryKey: ['work', id],
    queryFn: () => worksApi.getById(id),
    enabled: !!id,
  })
