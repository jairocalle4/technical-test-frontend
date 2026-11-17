import { useMemo } from 'react'
import type { AssembledKit, ReceptionItem, Recipe } from '../../api/schemas.ts'
import { Section } from '../../components/ui/Section.tsx'
import { computeAvailability, toAvailableQuantities } from '../../domain/availability.ts'
import { AssembleKitForm } from '../kits/AssembleKitForm.tsx'
import { ReceptionTable } from './ReceptionTable.tsx'

type Props = {
  items: readonly ReceptionItem[]
  recipes: readonly Recipe[]
  kits: readonly AssembledKit[]
}

export function ReceptionWorkspace({ items, recipes, kits }: Props) {
  const availability = useMemo(
    () => computeAvailability(items, recipes, kits),
    [items, recipes, kits],
  )
  const availableByItem = useMemo(() => toAvailableQuantities(availability), [availability])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Section
        title="Recepción y disponibilidad"
        description="Las piezas con novedad no se usan para armar kits."
        className="lg:col-span-2"
      >
        <ReceptionTable items={items} availability={availability} />
      </Section>
      <Section title="Armar kit">
        <AssembleKitForm recipes={recipes} items={items} availableByItem={availableByItem} />
      </Section>
    </div>
  )
}
