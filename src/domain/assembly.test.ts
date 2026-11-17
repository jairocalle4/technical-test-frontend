import { describe, expect, it } from 'vitest'
import {
  fullPatKit,
  kitEpdRecipe,
  kitPatRecipe,
  partialEpdKit,
  receptionItems,
  recipes,
} from './__fixtures__/reception.ts'
import { isPartialAssembly, maxAssemblable } from './assembly.ts'
import { computeAvailability, toAvailableQuantities } from './availability.ts'

const availableWith = (kits: Parameters<typeof computeAvailability>[2]) =>
  toAvailableQuantities(computeAvailability(receptionItems, recipes, kits))

describe('maxAssemblable', () => {
  it('returns the quantity allowed by the limiting part', () => {
    expect(maxAssemblable(kitEpdRecipe, availableWith([]))).toBe(5)
    expect(maxAssemblable(kitPatRecipe, availableWith([]))).toBe(2)
  })

  it('returns 0 when there are not enough parts for one kit', () => {
    expect(maxAssemblable(kitPatRecipe, availableWith([partialEpdKit]))).toBe(0)
  })

  it('returns 0 when a recipe part is missing from the reception', () => {
    const recipeWithUnknownPart = { ...kitEpdRecipe, parts: [{ item_id: 999, quantity: 1 }] }
    expect(maxAssemblable(recipeWithUnknownPart, availableWith([]))).toBe(0)
  })
})

describe('isPartialAssembly', () => {
  it('flags kits assembled below the requested quantity', () => {
    expect(isPartialAssembly(partialEpdKit)).toBe(true)
    expect(isPartialAssembly(fullPatKit)).toBe(false)
  })
})
