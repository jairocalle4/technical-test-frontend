import type { AssembledKit, Recipe } from '../api/schemas.ts'

/** Kits that can really be assembled: the limiting part decides (min of available / required). */
export function maxAssemblable(
  recipe: Recipe,
  availableByItem: ReadonlyMap<number, number>,
): number {
  if (recipe.parts.length === 0) return 0
  return Math.min(
    ...recipe.parts.map((part) =>
      Math.floor((availableByItem.get(part.item_id) ?? 0) / part.quantity),
    ),
  )
}

export function isPartialAssembly(kit: AssembledKit): boolean {
  return kit.assembled_quantity < kit.requested_quantity
}
