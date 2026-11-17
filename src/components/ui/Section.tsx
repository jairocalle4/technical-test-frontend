import { useId, type ReactNode } from 'react'
import { cn } from './cn.ts'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ title, description, actions, children, className }: Props) {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className={cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6', className)}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          {description !== undefined && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}
