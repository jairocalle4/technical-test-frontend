import type { ReactNode } from 'react'
import type { ApiError } from '../../api/errors.ts'
import { Alert } from './Alert.tsx'

type Props = {
  error: ApiError
  action?: ReactNode
}

export function ApiErrorAlert({ error, action }: Props) {
  const detailMessages = Object.entries(error.details).flatMap(([field, messages]) =>
    messages.map((message) => ({ key: `${field}:${message}`, message })),
  )

  return (
    <Alert tone="error" title={error.message}>
      {detailMessages.length > 0 && (
        <ul className="list-disc space-y-1 pl-5">
          {detailMessages.map((detail) => (
            <li key={detail.key}>{detail.message}</li>
          ))}
        </ul>
      )}
      {action !== undefined && <div className="mt-3">{action}</div>}
    </Alert>
  )
}
