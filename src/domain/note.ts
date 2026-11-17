import type { AssembledKit, ReceptionItem, Recipe } from '../api/schemas.ts'
import { computeAvailability } from './availability.ts'
import { toCents, type Cents } from './money.ts'

export type NoteLine = {
  key: string
  code: string
  description: string
  quantity: number
  unitCostCents: Cents
  totalCents: Cents
  details: string[]
}

export type NoteBlock = {
  lines: NoteLine[]
  totalCents: Cents
}

export type NoteSummary = {
  assembledKits: NoteBlock
  goodLooseParts: NoteBlock
  partsWithIssues: NoteBlock
  totalCents: Cents
}

function toBlock(lines: NoteLine[]): NoteBlock {
  return {
    lines,
    totalCents: lines.reduce((total, line) => total + line.totalCents, 0),
  }
}

function buildLine(
  key: string,
  code: string,
  description: string,
  quantity: number,
  unitCost: number,
  details: string[] = [],
): NoteLine {
  const unitCostCents = toCents(unitCost)
  return {
    key,
    code,
    description,
    quantity,
    unitCostCents,
    totalCents: unitCostCents * quantity,
    details,
  }
}

/**
 * Reception note footer: assembled kits + good leftover parts + parts with issues.
 * Every unit counted ends up in exactly one block, so the total never changes.
 */
export function buildNoteSummary(
  items: readonly ReceptionItem[],
  recipes: readonly Recipe[],
  kits: readonly AssembledKit[],
): NoteSummary {
  const availability = computeAvailability(items, recipes, kits)

  const kitLines = kits.map((kit) =>
    buildLine(kit.assembly_id, kit.kit_code, kit.description, kit.assembled_quantity, kit.unit_cost),
  )

  const goodLooseLines = items.flatMap((item) => {
    const available = availability.get(item.item_id)?.available ?? 0
    return available > 0
      ? [buildLine(`good-${item.item_id}`, item.code, item.description, available, item.cost)]
      : []
  })

  const issueLines = items.flatMap((item) => {
    const itemAvailability = availability.get(item.item_id)
    if (itemAvailability === undefined || itemAvailability.issuesQuantity === 0) return []
    return [
      buildLine(
        `issue-${item.item_id}`,
        item.code,
        item.description,
        itemAvailability.issuesQuantity,
        item.cost,
        itemAvailability.issueDetails,
      ),
    ]
  })

  const assembledKits = toBlock(kitLines)
  const goodLooseParts = toBlock(goodLooseLines)
  const partsWithIssues = toBlock(issueLines)

  return {
    assembledKits,
    goodLooseParts,
    partsWithIssues,
    totalCents: assembledKits.totalCents + goodLooseParts.totalCents + partsWithIssues.totalCents,
  }
}
