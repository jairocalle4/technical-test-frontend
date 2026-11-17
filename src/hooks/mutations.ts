import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelKit, createKit, resetReception } from '../api/endpoints.ts'
import { queryKeys } from './queries.ts'

export function useCreateKit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createKit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.assembledKits }),
  })
}

export function useCancelKit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelKit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.assembledKits }),
  })
}

export function useResetReception() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resetReception,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reception }),
  })
}
