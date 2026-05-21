import { apiClient } from './client'
import type { SpringPage, WorkDetail, WorkSummary } from '@/types'

export const worksApi = {
  search: (params: { q?: string; subject?: string; page?: number; size?: number }) =>
    apiClient.get<SpringPage<WorkSummary>>('/works', { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<WorkDetail>(`/works/${id}`).then((r) => r.data),

  lookupIsbn: (isbn: string) =>
    apiClient.get(`/isbn/${isbn}`).then((r) => r.data),
}
