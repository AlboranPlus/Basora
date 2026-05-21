import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { circulationApi } from '@/api/circulation'

export const useBorrowings = () =>
  useQuery({ queryKey: ['borrowings'], queryFn: circulationApi.myBorrowings })

export const useLentOut = () =>
  useQuery({ queryKey: ['lentOut'], queryFn: circulationApi.lentOut })

export const useHistory = () =>
  useQuery({ queryKey: ['history'], queryFn: circulationApi.history })

export const useBorrow = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: circulationApi.borrow,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['borrowings'] })
      qc.invalidateQueries({ queryKey: ['works'] })
    },
  })
}

export const useReturn = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => circulationApi.returnCopy(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['borrowings'] })
      qc.invalidateQueries({ queryKey: ['history'] })
      qc.invalidateQueries({ queryKey: ['works'] })
    },
  })
}

export const useRenew = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => circulationApi.renew(id, days),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['borrowings'] }),
  })
}
