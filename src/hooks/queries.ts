import { useQuery } from '@tanstack/react-query'
import { getAssembledKits, getReceptionItems, getRecipes } from '../api/endpoints.ts'

export const queryKeys = {
  reception: ['reception'],
  receptionItems: ['reception', 'items'],
  assembledKits: ['reception', 'kits'],
  recipes: ['recipes'],
} as const

export function useReceptionItems() {
  return useQuery({ queryKey: queryKeys.receptionItems, queryFn: getReceptionItems })
}

export function useRecipes() {
  return useQuery({ queryKey: queryKeys.recipes, queryFn: getRecipes })
}

export function useAssembledKits() {
  return useQuery({ queryKey: queryKeys.assembledKits, queryFn: getAssembledKits })
}
