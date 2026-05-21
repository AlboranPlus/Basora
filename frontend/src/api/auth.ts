import { apiClient } from './client'
import type { AuthResponse, MemberProfile } from '@/types'

export const authApi = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  me: () =>
    apiClient.get<MemberProfile>('/members/me').then((r) => r.data),
}
