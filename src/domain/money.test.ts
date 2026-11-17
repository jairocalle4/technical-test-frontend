import { describe, expect, it } from 'vitest'
import { formatCents, toCents } from './money.ts'

describe('toCents', () => {
  it('converts a float amount into integer cents', () => {
    expect(toCents(0.59)).toBe(59)
    expect(toCents(3)).toBe(300)
  })

  it('avoids the floating point error of multiplying decimals', () => {
    expect(395 * 0.59).not.toBe(233.05)
    expect(395 * toCents(0.59)).toBe(23305)
  })
})

describe('formatCents', () => {
  it('formats cents as US dollars with es-EC separators', () => {
    expect(formatCents(26305)).toBe('$263,05')
    expect(formatCents(123450)).toBe('$1.234,50')
  })
})
