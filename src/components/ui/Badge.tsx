import type { ReactNode } from 'react'
import { cn } from './cn.ts'

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger'

type Props = {
  tone?: BadgeTone
  children: ReactNode
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-300',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-300',
  warning: 'bg-amber-50 text-amber-900 ring-amber-400',
  danger: 'bg-rose-50 text-rose-800 ring-rose-300',
}

export function Badge({ tone = 'neutral', children }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  )
}
