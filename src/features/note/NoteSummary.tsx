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
import { formatCents } from '../../domain/money.ts'
import type { NoteBlock, NoteSummary as NoteSummaryData } from '../../domain/note.ts'

type BlockTone = 'kits' | 'good' | 'issues'

type BlockProps = {
  title: string
  block: NoteBlock
  tone: BlockTone
  emptyMessage: string
}

const blockToneClasses: Record<BlockTone, string> = {
  kits: 'border-indigo-200',
  good: 'border-emerald-200',
  issues: 'border-rose-300 bg-rose-50/40',
}

function NoteBlockTable({ title, block, tone, emptyMessage }: BlockProps) {
  return (
    <div className={cn('rounded-md border p-3', blockToneClasses[tone])}>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
        {title}
        {tone === 'issues' && <Badge tone="danger">Novedad</Badge>}
      </h3>
      {block.lines.length === 0 ? (
        <p className="text-sm text-slate-600">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <caption className="sr-only">{title}</caption>
            <thead className={theadClass}>
              <tr>
                <th scope="col" className={thClass}>Código</th>
                <th scope="col" className={thClass}>Descripción</th>
                <th scope="col" className={thNumericClass}>Cantidad</th>
                <th scope="col" className={thNumericClass}>Costo unitario</th>
                <th scope="col" className={thNumericClass}>Total</th>
              </tr>
            </thead>
            <tbody className={tbodyClass}>
              {block.lines.map((line) => (
                <tr key={line.key}>
                  <td className={cn(tdClass, 'font-mono text-xs')}>{line.code}</td>
                  <td className={tdClass}>
                    {line.description}
                    {line.details.length > 0 && (
                      <span className="block text-xs text-rose-800">{line.details.join(', ')}</span>
                    )}
                  </td>
                  <td className={tdNumericClass}>{line.quantity}</td>
                  <td className={tdNumericClass}>{formatCents(line.unitCostCents)}</td>
                  <td className={tdNumericClass}>{formatCents(line.totalCents)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <th scope="row" colSpan={4} className={cn(thNumericClass, 'normal-case')}>
                  Subtotal
                </th>
                <td className={cn(tdNumericClass, 'font-semibold')}>
                  {formatCents(block.totalCents)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}

type Props = {
  note: NoteSummaryData
}

export function NoteSummary({ note }: Props) {
  return (
    <div className="space-y-4">
      <NoteBlockTable
        title="1. Kits armados"
        block={note.assembledKits}
        tone="kits"
        emptyMessage="No hay kits armados."
      />
      <NoteBlockTable
        title="2. Piezas sueltas buenas"
        block={note.goodLooseParts}
        tone="good"
        emptyMessage="No quedan piezas buenas sin usar."
      />
      <NoteBlockTable
        title="3. Piezas con novedad"
        block={note.partsWithIssues}
        tone="issues"
        emptyMessage="No hay piezas con novedad."
      />
      <div
        aria-live="polite"
        className="flex flex-wrap items-end justify-between gap-2 rounded-md bg-slate-900 px-4 py-3 text-white"
      >
        <div>
          <p className="text-sm font-semibold">Total de la nota</p>
          <p className="text-xs text-slate-300">
            Kits {formatCents(note.assembledKits.totalCents)} + Sueltas{' '}
            {formatCents(note.goodLooseParts.totalCents)} + Novedad{' '}
            {formatCents(note.partsWithIssues.totalCents)}
          </p>
        </div>
        <p className="text-2xl font-semibold tabular-nums">{formatCents(note.totalCents)}</p>
      </div>
    </div>
  )
}
