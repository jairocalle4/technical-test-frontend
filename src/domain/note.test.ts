import { describe, expect, it } from 'vitest'
import { fullPatKit, partialEpdKit, receptionItems, recipes } from './__fixtures__/reception.ts'
import { buildNoteSummary } from './note.ts'

const EXPECTED_NOTE_TOTAL_CENTS = 26305

describe('buildNoteSummary', () => {
  it('splits the note into the three blocks before assembling', () => {
    const note = buildNoteSummary(receptionItems, recipes, [])

    expect(note.assembledKits.lines).toHaveLength(0)
    expect(note.goodLooseParts.totalCents).toBe(26205)
    expect(note.partsWithIssues.lines).toEqual([
      expect.objectContaining({ code: '5091377768', quantity: 2, totalCents: 100 }),
    ])
    expect(note.partsWithIssues.lines[0]?.details).toEqual(['DAÑADO - Oxidados'])
  })

  it('moves used parts into the kits block and drops parts left at 0', () => {
    const note = buildNoteSummary(receptionItems, recipes, [partialEpdKit])

    expect(note.assembledKits.totalCents).toBe(2500)
    expect(note.goodLooseParts.lines.map((line) => [line.code, line.quantity])).toEqual([
      ['5010054265', 1],
      ['5091176586', 1],
      ['0204050052F', 395],
    ])
  })

  it('keeps the note total identical before assembling, after assembling and after cancelling', () => {
    const before = buildNoteSummary(receptionItems, recipes, [])
    const afterPartial = buildNoteSummary(receptionItems, recipes, [partialEpdKit])
    const afterFull = buildNoteSummary(receptionItems, recipes, [fullPatKit])
    const afterCancel = buildNoteSummary(receptionItems, recipes, [])

    expect(before.totalCents).toBe(EXPECTED_NOTE_TOTAL_CENTS)
    expect(afterPartial.totalCents).toBe(EXPECTED_NOTE_TOTAL_CENTS)
    expect(afterFull.totalCents).toBe(EXPECTED_NOTE_TOTAL_CENTS)
    expect(afterCancel.totalCents).toBe(EXPECTED_NOTE_TOTAL_CENTS)
  })
})
