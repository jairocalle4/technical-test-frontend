# ERP Nexus · Recepción de Repuestos: Armado de Kits

React 19 + TypeScript (strict) + Vite · Tailwind CSS · TanStack Query v5 + axios · react-hook-form + zod · Zustand (solo toasts).

**Requisitos:** Node.js 22+ y Docker. **Ejecutar:** levanta el backend (`cd technical-test-backend && docker compose up --build`, API en `http://localhost:8000`) y en este repo corre `npm install` y `npm run dev` (http://localhost:5173). La URL del API se configura con `VITE_API_BASE_URL` (ver `.env.example`).
**Checks:** `npm run lint` · `npm run typecheck` · `npm run test` (Vitest: cálculos, validación del formulario y errores del API) · `npm run build`.

**Decisiones técnicas**
1. **Dinero en centavos enteros:** los costos llegan como float (`0.59`) y se convierten con `toCents`; sumas y productos se hacen con enteros y solo se formatea al mostrar. Un test verifica que el total de la nota (26305 centavos) es idéntico antes de armar, con armado parcial y después de anular.
2. **Estado derivado, no duplicado:** disponibilidad, máximo armable y nota son funciones puras en `src/domain/` (probadas con Vitest) calculadas desde los datos de TanStack Query; nada del servidor se copia a `useState` ni a Zustand. Toda respuesta HTTP se valida con zod.
3. **Contrato real del OpenAPI:** el reinicio usa `POST /receptions/current/reset/` (la ruta del enunciado responde 404). Se usa oxlint en lugar de ESLint porque typescript-eslint aún no soporta TypeScript 7, que trae la plantilla de Vite.

Usé un asistente de IA (Claude Code) como herramienta de desarrollo.
