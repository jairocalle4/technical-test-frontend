/** Integer amount of cents. All money math is done in cents to avoid floating point errors. */
export type Cents = number

export function toCents(amount: number): Cents {
  return Math.round(amount * 100)
}

const currencyFormatter = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
})

export function formatCents(cents: Cents): string {
  return currencyFormatter.format(cents / 100)
}
