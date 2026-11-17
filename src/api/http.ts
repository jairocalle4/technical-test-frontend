import axios from 'axios'

const DEFAULT_API_BASE_URL = 'http://localhost:8000'
const API_PREFIX = '/api/v1/core-spares'

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL}${API_PREFIX}`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})
