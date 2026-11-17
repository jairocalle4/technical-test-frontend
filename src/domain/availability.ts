import type { AssembledKit, ReceptionItem, Recipe } from '../api/schemas.ts'

export type ItemAvailability = {
  itemId: number
  issuesQuantity: number
  issueDetails: string[]
  usedInKits: number
  available: number
}

export function sumIssues(item: ReceptionItem): number {
  return item.issues.reduce((total, issue) => total + issue.quantity, 0)
}

export function formatIssueDetails(item: ReceptionItem): string[] {
  return item.issues.map((issue) => `${issue.type} - ${issue.observation}`)
}

/** Units of each item consumed by the assembled kits, according to each kit's recipe. */
export function computeUsedInKits(
  kits: readonly AssembledKit[],
  recipes: readonly Recipe[],
): Map<number, number> {
  const recipesById = new Map(recipes.map((recipe) => [recipe.recipe_id, recipe]))
  const usedByItem = new Map<number, number>()

  for (const kit of kits) {
    const recipe = recipesById.get(kit.recipe_id)
    if (recipe === undefined) continue
    for (const part of recipe.parts) {
      const used = part.quantity * kit.assembled_quantity
      usedByItem.set(part.item_id, (usedByItem.get(part.item_id) ?? 0) + used)
    }
  }
  return usedByItem
}

/** Available for kits = counted - with issues - used in assembled kits (never below 0). */
export function computeAvailability(
  items: readonly ReceptionItem[],
  recipes: readonly Recipe[],
  kits: readonly AssembledKit[],
): Map<number, ItemAvailability> {
  const usedByItem = computeUsedInKits(kits, recipes)

  return new Map(
    items.map((item) => {
      const issuesQuantity = sumIssues(item)
      const usedInKits = usedByItem.get(item.item_id) ?? 0
      const availability: ItemAvailability = {
        itemId: item.item_id,
        issuesQuantity,
        issueDetails: formatIssueDetails(item),
        usedInKits,
        available: Math.max(0, item.counted_quantity - issuesQuantity - usedInKits),
      }
      return [item.item_id, availability]
    }),
  )
}

export function toAvailableQuantities(
  availability: ReadonlyMap<number, ItemAvailability>,
): Map<number, number> {
  return new Map([...availability].map(([itemId, value]) => [itemId, value.available]))
}
