import { z } from 'zod'

export const issueSchema = z.object({
  type: z.string(),
  quantity: z.number().int(),
  observation: z.string(),
})

export const receptionItemSchema = z.object({
  item_id: z.number().int(),
  code: z.string(),
  description: z.string(),
  item_type: z.enum(['KIT', 'COMPONENT', 'LOOSE']),
  counted_quantity: z.number().int(),
  cost: z.number(),
  issues: z.array(issueSchema),
})

export const recipePartSchema = z.object({
  item_id: z.number().int(),
  quantity: z.number().int().positive(),
})

export const recipeSchema = z.object({
  recipe_id: z.number().int(),
  kit_item_id: z.number().int(),
  kit_code: z.string(),
  description: z.string(),
  parts: z.array(recipePartSchema),
})

export const assembledKitSchema = z.object({
  assembly_id: z.string(),
  recipe_id: z.number().int(),
  kit_item_id: z.number().int(),
  kit_code: z.string(),
  description: z.string(),
  requested_quantity: z.number().int(),
  assembled_quantity: z.number().int(),
  unit_cost: z.number(),
  total_cost: z.number(),
  notice: z.string().nullish(),
})

export const deleteKitResultSchema = z.object({
  assembly_id: z.string(),
})

const metaSchema = z.object({
  total: z.number().int(),
  page: z.number().int(),
  per_page: z.number().int(),
  total_pages: z.number().int(),
})

export function paginatedSchema<T extends z.ZodType>(item: T) {
  return z.object({ data: z.array(item), meta: metaSchema })
}

export function envelopeSchema<T extends z.ZodType>(result: T) {
  return z.object({ code: z.literal(1), message: z.string(), result })
}

export const apiErrorSchema = z.object({
  code: z.literal(0),
  message: z.string(),
  details: z.record(z.string(), z.array(z.string())).default({}),
})

export const fastApiErrorSchema = z.object({
  detail: z.string(),
})

export type Issue = z.infer<typeof issueSchema>
export type ReceptionItem = z.infer<typeof receptionItemSchema>
export type RecipePart = z.infer<typeof recipePartSchema>
export type Recipe = z.infer<typeof recipeSchema>
export type AssembledKit = z.infer<typeof assembledKitSchema>

export type CreateKitPayload = {
  recipe_id: number
  requested_quantity: number
}
