import type { ReceptionItem, Recipe } from '../../api/schemas.ts'
import { Alert } from '../../components/ui/Alert.tsx'
import { Badge } from '../../components/ui/Badge.tsx'
import {
  tableClass,
  tbodyClass,
  tdClass,
  tdNumericClass,
  thClass,
  theadClass,
  thNumericClass,
} from '../../components/ui/tableStyles.ts'
import { maxAssemblable } from '../../domain/assembly.ts'

type Props = {
  recipe: Recipe | undefined
  requestedQuantity: number | undefined
  items: readonly ReceptionItem[]
  availableByItem: ReadonlyMap<number, number>
}

export function KitPreview({ recipe, requestedQuantity, items, availableByItem }: Props) {
  if (recipe === undefined) {
    return (
      <p className="text-sm text-slate-600">
        Selecciona una receta para ver cuántos kits se pueden armar.
      </p>
    )
  }

  const maxKits = maxAssemblable(recipe, availableByItem)
  const itemsById = new Map(items.map((item) => [item.item_id, item]))
  const parts = recipe.parts.map((part) => {
    const available = availableByItem.get(part.item_id) ?? 0
    return {
      ...part,
      available,
      name: itemsById.get(part.item_id)?.description ?? `Ítem ${part.item_id}`,
      isLimiting: Math.floor(available / part.quantity) === maxKits,
    }
  })
  const limitingNames = parts.filter((part) => part.isLimiting).map((part) => part.name)
  const exceedsMax =
    requestedQuantity !== undefined &&
    Number.isInteger(requestedQuantity) &&
    requestedQuantity > maxKits

  return (
    <div className="space-y-3">
      <div className="rounded-md bg-slate-50 px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Máximo armable</p>
        <p className="text-2xl font-semibold tabular-nums text-slate-900">{maxKits} kit(s)</p>
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <caption className="sr-only">Piezas requeridas por kit de {recipe.kit_code}</caption>
          <thead className={theadClass}>
            <tr>
              <th scope="col" className={thClass}>Pieza</th>
              <th scope="col" className={thNumericClass}>Por kit</th>
              <th scope="col" className={thNumericClass}>Disponible</th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {parts.map((part) => (
              <tr key={part.item_id}>
                <td className={tdClass}>
                  <span className="mr-2">{part.name}</span>
                  {part.isLimiting && <Badge tone="warning">Limitante</Badge>}
                </td>
                <td className={tdNumericClass}>{part.quantity}</td>
                <td className={tdNumericClass}>{part.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-600">
        <span className="font-medium">Limitante:</span> la pieza que alcanza para menos kits y
        define el máximo armable.
      </p>

      <div aria-live="polite">
        {maxKits === 0 ? (
          <Alert tone="warning" title="Sin piezas suficientes">
            Con la disponibilidad actual no alcanza para armar ni 1 kit de {recipe.kit_code}{' '}
            (falta: {limitingNames.join(', ')}). Si envías la solicitud, será rechazada.
          </Alert>
        ) : (
          exceedsMax && (
            <Alert tone="warning" title={`Solo alcanza para ${maxKits} kit(s)`}>
              Solicitaste {requestedQuantity} kit(s), pero las piezas disponibles solo alcanzan
              para armar {maxKits}. Si confirmas, se armarán {maxKits}.
            </Alert>
          )
        )}
      </div>
    </div>
  )
}
