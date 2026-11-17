import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { isClientError, toApiError } from './errors.ts'

function httpError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() }
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, undefined, {
    data,
    status,
    statusText: '',
    headers: {},
    config,
  })
}

describe('toApiError', () => {
  it('reads message and details from the backend error envelope (422)', () => {
    const error = httpError(422, {
      code: 0,
      message: 'Stock insuficiente para armar al menos 1 KIT-PAT.',
      details: { stock: ['Resorte (disponible: 0, requerido por kit: 4)'] },
    })

    expect(toApiError(error)).toEqual({
      status: 422,
      message: 'Stock insuficiente para armar al menos 1 KIT-PAT.',
      details: { stock: ['Resorte (disponible: 0, requerido por kit: 4)'] },
    })
    expect(isClientError(error)).toBe(true)
  })

  it('reads the default FastAPI { detail } format', () => {
    expect(toApiError(httpError(404, { detail: 'Not Found' }))).toEqual({
      status: 404,
      message: 'Not Found',
      details: {},
    })
  })

  it('explains a network error when the backend is not running', () => {
    const networkError = new AxiosError('Network Error', 'ERR_NETWORK')

    expect(toApiError(networkError).status).toBeNull()
    expect(toApiError(networkError).message).toContain('No se pudo conectar con el servidor')
    expect(isClientError(networkError)).toBe(false)
  })
})
