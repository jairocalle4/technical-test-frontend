import type { ReactNode } from 'react'
import { cn } from './cn.ts'

export type AlertTone = 'info' | 'success' | 'warning' | 'error'

type Props = {
  tone: AlertTone
  title: string
  children?: ReactNode
  className?: string
}

const toneClasses: Record<AlertTone, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  error: 'border-rose-300 bg-rose-50 text-rose-900',
}

export function Alert({ tone, title, children, className }: Props) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('rounded-md border px-4 py-3 text-sm', toneClasses[tone], className)}
    >
      <p className="font-semibold">{title}</p>
      {children !== undefined && <div className="mt-1">{children}</div>}
    </div>
  )
}
