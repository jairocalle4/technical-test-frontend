import { isAxiosError } from 'axios'
import { ZodError } from 'zod'
import { apiErrorSchema, fastApiErrorSchema } from './schemas.ts'

export type ApiError = {
  status: number | null
  message: string
  details: Record<string, string[]>
}

const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.'

export function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const response = error.response
    if (response === undefined) {
      return { status: null, message: NETWORK_ERROR_MESSAGE, details: {} }
    }
    const backendError = apiErrorSchema.safeParse(response.data)
    if (backendError.success) {
      return {
        status: response.status,
        message: backendError.data.message,
        details: backendError.data.details,
      }
    }
    const fastApiError = fastApiErrorSchema.safeParse(response.data)
    return {
      status: response.status,
      message: fastApiError.success
        ? fastApiError.data.detail
        : `Error inesperado del servidor (HTTP ${response.status}).`,
      details: {},
    }
  }
  if (error instanceof ZodError) {
    return {
      status: null,
      message: 'La respuesta del servidor no tiene el formato esperado.',
      details: {
        response: error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      },
    }
  }
  if (error instanceof Error) {
    return { status: null, message: error.message, details: {} }
  }
  return { status: null, message: 'Ocurrió un error desconocido.', details: {} }
}

export function isClientError(error: unknown): boolean {
  const { status } = toApiError(error)
  return status !== null && status >= 400 && status < 500
}
