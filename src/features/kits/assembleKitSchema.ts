import { z } from 'zod'

export const assembleKitSchema = z.object({
  recipe_id: z
    .number({ error: 'Selecciona una receta' })
    .int('Selecciona una receta')
    .positive('Selecciona una receta'),
  requested_quantity: z
    .number({ error: 'Ingresa una cantidad' })
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0'),
})

export type AssembleKitFormValues = z.infer<typeof assembleKitSchema>
