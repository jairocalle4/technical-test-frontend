import type { ReceptionItem } from '../../api/schemas.ts'
import { Badge } from '../../components/ui/Badge.tsx'
import { cn } from '../../components/ui/cn.ts'
import {
  tableClass,
  tbodyClass,
  tdClass,
  tdNumericClass,
  thClass,
  theadClass,
  thNumericClass,
} from '../../components/ui/tableStyles.ts'
import type { ItemAvailability } from '../../domain/availability.ts'

type Props = {
  items: readonly ReceptionItem[]
  availability: ReadonlyMap<number, ItemAvailability>
}

export function ReceptionTable({ items, availability }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className={tableClass}>
        <caption className="sr-only">
          Conteo de la recepción con novedades y disponibilidad de piezas para kits
        </caption>
        <thead className={theadClass}>
          <tr>
            <th scope="col" className={thClass}>Código</th>
            <th scope="col" className={thClass}>Descripción</th>
            <th scope="col" className={thNumericClass}>Cantidad contada</th>
            <th scope="col" className={thClass}>Con novedad</th>
            <th scope="col" className={thNumericClass}>En kits</th>
            <th scope="col" className={thNumericClass}>Disponible para kits</th>
          </tr>
        </thead>
        <tbody className={tbodyClass}>
          {items.map((item) => {
            const itemAvailability = availability.get(item.item_id)
            const issuesQuantity = itemAvailability?.issuesQuantity ?? 0
            const available = itemAvailability?.available ?? 0
            return (
              <tr key={item.item_id}>
                <td className={cn(tdClass, 'font-mono text-xs')}>{item.code}</td>
                <td className={tdClass}>{item.description}</td>
                <td className={tdNumericClass}>{item.counted_quantity}</td>
                <td className={tdClass}>
                  {issuesQuantity > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums text-rose-700">
                          {issuesQuantity}
                        </span>
                        <Badge tone="danger">Novedad</Badge>
                      </div>
                      <ul className="text-xs text-rose-800">
                        {itemAvailability?.issueDetails.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <span className="tabular-nums text-slate-500">0</span>
                  )}
                </td>
                <td className={tdNumericClass}>{itemAvailability?.usedInKits ?? 0}</td>
                <td
                  className={cn(
                    tdNumericClass,
                    available > 0 ? 'font-semibold text-emerald-700' : 'text-slate-500',
                  )}
                >
                  {available}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
