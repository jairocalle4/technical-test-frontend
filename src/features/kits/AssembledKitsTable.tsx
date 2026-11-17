import { toApiError } from '../../api/errors.ts'
import type { AssembledKit } from '../../api/schemas.ts'
import { ApiErrorAlert } from '../../components/ui/ApiErrorAlert.tsx'
import { Badge } from '../../components/ui/Badge.tsx'
import { Button } from '../../components/ui/Button.tsx'
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
import { isPartialAssembly } from '../../domain/assembly.ts'
import { formatCents, toCents } from '../../domain/money.ts'
import { useCancelKit } from '../../hooks/mutations.ts'
import { useToastStore } from '../../store/toastStore.ts'

type Props = {
  kits: readonly AssembledKit[]
}

export function AssembledKitsTable({ kits }: Props) {
  const cancelKit = useCancelKit()
  const pushToast = useToastStore((state) => state.push)

  const handleCancel = (assemblyId: string) => {
    cancelKit.mutate(assemblyId, {
      onSuccess: ({ message }) => pushToast({ tone: 'success', message }),
    })
  }

  if (kits.length === 0) {
    return <p className="text-sm text-slate-600">Aún no hay kits armados en esta recepción.</p>
  }

  return (
    <div className="space-y-3">
      {cancelKit.isError && <ApiErrorAlert error={toApiError(cancelKit.error)} />}
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <caption className="sr-only">Kits armados en la recepción actual</caption>
          <thead className={theadClass}>
            <tr>
              <th scope="col" className={thClass}>Código de kit</th>
              <th scope="col" className={thClass}>Descripción</th>
              <th scope="col" className={thNumericClass}>Solicitado</th>
              <th scope="col" className={thNumericClass}>Armado</th>
              <th scope="col" className={thNumericClass}>Costo unitario</th>
              <th scope="col" className={thNumericClass}>Total</th>
              <th scope="col" className={thClass}>
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {kits.map((kit) => {
              const partial = isPartialAssembly(kit)
              const unitCostCents = toCents(kit.unit_cost)
              const isCancelling = cancelKit.isPending && cancelKit.variables === kit.assembly_id
              return (
                <tr key={kit.assembly_id} className={cn(partial && 'bg-amber-50')}>
                  <td className={cn(tdClass, 'font-mono text-xs')}>{kit.kit_code}</td>
                  <td className={tdClass}>{kit.description}</td>
                  <td className={tdNumericClass}>{kit.requested_quantity}</td>
                  <td className={tdNumericClass}>
                    <div className="flex items-center justify-end gap-2">
                      {partial && <Badge tone="warning">Parcial</Badge>}
                      <span className={cn(partial && 'font-semibold text-amber-800')}>
                        {kit.assembled_quantity}
                      </span>
                    </div>
                  </td>
                  <td className={tdNumericClass}>{formatCents(unitCostCents)}</td>
                  <td className={cn(tdNumericClass, 'font-medium')}>
                    {formatCents(unitCostCents * kit.assembled_quantity)}
                  </td>
                  <td className={cn(tdClass, 'text-right')}>
                    <Button
                      variant="danger"
                      loading={isCancelling}
                      loadingText="Anulando…"
                      disabled={cancelKit.isPending && !isCancelling}
                      aria-label={`Anular ${kit.assembled_quantity} kit(s) ${kit.kit_code}`}
                      onClick={() => handleCancel(kit.assembly_id)}
                    >
                      Anular
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
