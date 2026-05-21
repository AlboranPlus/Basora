import { apiClient } from './client'
import type { Borrowing } from '@/types'

export const circulationApi = {
  borrow: (data: { copyId: string; lenderId?: string; durationDays: number }) =>
    apiClient.post<Borrowing>('/circulation/borrow', data).then((r) => r.data),

  returnCopy: (borrowingId: string) =>
    apiClient.post<Borrowing>(`/circulation/borrowings/${borrowingId}/return`).then((r) => r.data),

  renew: (borrowingId: string, extraDays: number) =>
    apiClient.post<Borrowing>(`/circulation/borrowings/${borrowingId}/renew`, { extraDays }).then((r) => r.data),

  myBorrowings: () =>
    apiClient.get<Borrowing[]>('/circulation/borrowings').then((r) => r.data),

  lentOut: () =>
    apiClient.get<Borrowing[]>('/circulation/lent').then((r) => r.data),

  history: () =>
    apiClient.get<Borrowing[]>('/circulation/history').then((r) => r.data),

  rateWork: (data: { borrowingId: string; score: number; review?: string }) =>
    apiClient.post('/circulation/ratings/work', data).then((r) => r.data),

  rateBorrower: (data: { borrowingId: string; score: number; comment?: string }) =>
    apiClient.post('/circulation/ratings/borrower', data).then((r) => r.data),
}
