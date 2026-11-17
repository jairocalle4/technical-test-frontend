import { toApiError } from '../../api/errors.ts'
import { Button } from '../../components/ui/Button.tsx'
import { useResetReception } from '../../hooks/mutations.ts'
import { useToastStore } from '../../store/toastStore.ts'

export function ResetReceptionButton() {
  const resetReception = useResetReception()
  const pushToast = useToastStore((state) => state.push)

  const handleReset = () => {
    resetReception.mutate(undefined, {
      onSuccess: ({ message }) => pushToast({ tone: 'success', message }),
      onError: (error) => pushToast({ tone: 'error', message: toApiError(error).message }),
    })
  }

  return (
    <Button
      variant="secondary"
      loading={resetReception.isPending}
      loadingText="Reiniciando…"
      onClick={handleReset}
    >
      Reiniciar recepción
    </Button>
  )
}
