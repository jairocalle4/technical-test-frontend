import { describe, expect, it } from 'vitest'
import { assembleKitSchema } from './assembleKitSchema.ts'

const firstMessage = (input: unknown) => {
  const result = assembleKitSchema.safeParse(input)
  return result.success ? null : (result.error.issues[0]?.message ?? null)
}

describe('assembleKitSchema', () => {
  it('accepts a selected recipe and a positive integer quantity', () => {
    expect(assembleKitSchema.safeParse({ recipe_id: 10, requested_quantity: 3 }).success).toBe(true)
  })

  it('rejects 0 and negative quantities', () => {
    expect(firstMessage({ recipe_id: 10, requested_quantity: 0 })).toBe('Debe ser mayor a 0')
    expect(firstMessage({ recipe_id: 10, requested_quantity: -2 })).toBe('Debe ser mayor a 0')
  })

  it('rejects decimal quantities', () => {
    expect(firstMessage({ recipe_id: 10, requested_quantity: 1.5 })).toBe(
      'Debe ser un número entero',
    )
  })

  it('asks for a quantity and a recipe when the fields are empty', () => {
    expect(firstMessage({ recipe_id: 10, requested_quantity: Number.NaN })).toBe(
      'Ingresa una cantidad',
    )
    expect(firstMessage({ recipe_id: Number.NaN, requested_quantity: 1 })).toBe(
      'Selecciona una receta',
    )
  })
})
