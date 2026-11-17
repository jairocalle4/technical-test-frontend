import { toApiError } from './api/errors.ts'
import { ApiErrorAlert } from './components/ui/ApiErrorAlert.tsx'
import { Button } from './components/ui/Button.tsx'
import { Toaster } from './components/ui/Toaster.tsx'
import { ReceptionWorkspace } from './features/reception/ReceptionWorkspace.tsx'
import { ResetReceptionButton } from './features/reception/ResetReceptionButton.tsx'
import { useAssembledKits, useReceptionItems, useRecipes } from './hooks/queries.ts'

export function App() {
  const itemsQuery = useReceptionItems()
  const recipesQuery = useRecipes()
  const kitsQuery = useAssembledKits()

  const items = itemsQuery.data
  const recipes = recipesQuery.data
  const kits = kitsQuery.data
  const loadError = itemsQuery.error ?? recipesQuery.error ?? kitsQuery.error

  const retryAll = () => {
    void itemsQuery.refetch()
    void recipesQuery.refetch()
    void kitsQuery.refetch()
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-indigo-700">ERP Nexus · Core Spares</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Recepción de Repuestos: Armado de Kits
          </h1>
        </div>
        <ResetReceptionButton />
      </header>

      {items !== undefined && recipes !== undefined && kits !== undefined ? (
        <ReceptionWorkspace items={items} recipes={recipes} kits={kits} />
      ) : loadError !== null ? (
        <ApiErrorAlert
          error={toApiError(loadError)}
          action={
            <Button variant="secondary" onClick={retryAll}>
              Reintentar
            </Button>
          }
        />
      ) : (
        <p role="status" className="text-sm text-slate-600">
          Cargando recepción…
        </p>
      )}
      <Toaster />
    </main>
  )
}
