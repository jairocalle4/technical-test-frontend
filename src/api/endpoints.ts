import { z } from 'zod'
import { http } from './http.ts'
import {
  assembledKitSchema,
  deleteKitResultSchema,
  envelopeSchema,
  paginatedSchema,
  receptionItemSchema,
  recipeSchema,
  type AssembledKit,
  type CreateKitPayload,
  type ReceptionItem,
  type Recipe,
} from './schemas.ts'

const MAX_PER_PAGE = 50

export type MutationResult<T> = {
  message: string
  result: T
}

async function fetchAllPages<T extends z.ZodType>(
  path: string,
  itemSchema: T,
): Promise<z.output<T>[]> {
  const pageSchema = envelopeSchema(paginatedSchema(itemSchema))
  const fetchPage = async (page: number) => {
    const response = await http.get<unknown>(path, {
      params: { page, per_page: MAX_PER_PAGE },
    })
    return pageSchema.parse(response.data).result
  }

  const firstPage = await fetchPage(1)
  const remainingPages = Array.from(
    { length: Math.max(0, firstPage.meta.total_pages - 1) },
    (_, index) => index + 2,
  )
  const otherPages = await Promise.all(remainingPages.map(fetchPage))
  return [firstPage, ...otherPages].flatMap((page) => page.data)
}

export function getReceptionItems(): Promise<ReceptionItem[]> {
  return fetchAllPages('/receptions/current/items/', receptionItemSchema)
}

export function getRecipes(): Promise<Recipe[]> {
  return fetchAllPages('/recipes/', recipeSchema)
}

export function getAssembledKits(): Promise<AssembledKit[]> {
  return fetchAllPages('/receptions/current/kits/', assembledKitSchema)
}

export async function createKit(
  payload: CreateKitPayload,
): Promise<MutationResult<AssembledKit>> {
  const response = await http.post<unknown>('/receptions/current/kits/', payload)
  const { message, result } = envelopeSchema(assembledKitSchema).parse(response.data)
  return { message, result }
}

export async function cancelKit(assemblyId: string): Promise<MutationResult<string>> {
  const response = await http.delete<unknown>(
    `/receptions/current/kits/${encodeURIComponent(assemblyId)}/`,
  )
  const { message, result } = envelopeSchema(deleteKitResultSchema).parse(response.data)
  return { message, result: result.assembly_id }
}

export async function resetReception(): Promise<MutationResult<null>> {
  const response = await http.post<unknown>('/receptions/current/reset/')
  const { message } = envelopeSchema(z.null()).parse(response.data)
  return { message, result: null }
}
