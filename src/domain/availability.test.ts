import { describe, expect, it } from 'vitest'
import { fullPatKit, partialEpdKit, receptionItems, recipes } from './__fixtures__/reception.ts'
import { computeAvailability, formatIssueDetails, sumIssues } from './availability.ts'

const availableOf = (availability: ReturnType<typeof computeAvailability>, itemId: number) =>
  availability.get(itemId)?.available

describe('sumIssues and formatIssueDetails', () => {
  it('sums the issue quantities and shows TYPE - observation', () => {
    const spring = receptionItems[2]
    expect(spring).toBeDefined()
    if (spring === undefined) return
    expect(sumIssues(spring)).toBe(2)
    expect(formatIssueDetails(spring)).toEqual(['DAÑADO - Oxidados'])
  })
})

describe('computeAvailability', () => {
  it('subtracts only the issues when there are no assembled kits', () => {
    const availability = computeAvailability(receptionItems, recipes, [])
    expect(availableOf(availability, 1)).toBe(6)
    expect(availableOf(availability, 2)).toBe(6)
    expect(availableOf(availability, 3)).toBe(10)
    expect(availableOf(availability, 4)).toBe(395)
  })

  it('subtracts the parts used by assembled kits according to their recipe', () => {
    const availability = computeAvailability(receptionItems, recipes, [partialEpdKit])
    expect(availableOf(availability, 1)).toBe(1)
    expect(availableOf(availability, 2)).toBe(1)
    expect(availableOf(availability, 3)).toBe(0)
    expect(availability.get(3)?.usedInKits).toBe(10)
  })

  it('never returns a negative availability', () => {
    const oversizedKit = { ...fullPatKit, assembled_quantity: 50 }
    const availability = computeAvailability(receptionItems, recipes, [oversizedKit])
    expect(availableOf(availability, 1)).toBe(0)
    expect(availableOf(availability, 3)).toBe(0)
  })
})
