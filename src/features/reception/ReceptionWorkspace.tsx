import { useMemo } from 'react'
import type { AssembledKit, ReceptionItem, Recipe } from '../../api/schemas.ts'
import { Section } from '../../components/ui/Section.tsx'
import { computeAvailability, toAvailableQuantities } from '../../domain/availability.ts'
import { buildNoteSummary } from '../../domain/note.ts'
import { AssembledKitsTable } from '../kits/AssembledKitsTable.tsx'
import { AssembleKitForm } from '../kits/AssembleKitForm.tsx'
import { NoteSummary } from '../note/NoteSummary.tsx'
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
  const note = useMemo(() => buildNoteSummary(items, recipes, kits), [items, recipes, kits])

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
      <Section
        title="Kits armados"
        description="Anular un kit devuelve todas sus piezas a la disponibilidad."
        className="lg:col-span-3"
      >
        <AssembledKitsTable kits={kits} />
      </Section>
      <Section
        title="Pie de la nota"
        description="Detalle final y cuadre total de la recepción."
        className="lg:col-span-3"
      >
        <NoteSummary note={note} />
      </Section>
    </div>
  )
}
