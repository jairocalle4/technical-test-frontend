import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toApiError } from '../../api/errors.ts'
import type { ReceptionItem, Recipe } from '../../api/schemas.ts'
import { Alert } from '../../components/ui/Alert.tsx'
import { ApiErrorAlert } from '../../components/ui/ApiErrorAlert.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { cn } from '../../components/ui/cn.ts'
import { isPartialAssembly } from '../../domain/assembly.ts'
import { useCreateKit } from '../../hooks/mutations.ts'
import { assembleKitSchema, type AssembleKitFormValues } from './assembleKitSchema.ts'
import { KitPreview } from './KitPreview.tsx'

type Props = {
  recipes: readonly Recipe[]
  items: readonly ReceptionItem[]
  availableByItem: ReadonlyMap<number, number>
}

const fieldClass =
  'mt-1 block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'

export function AssembleKitForm({ recipes, items, availableByItem }: Props) {
  const createKit = useCreateKit()
  const recipeFieldId = useId()
  const quantityFieldId = useId()
  const recipeErrorId = `${recipeFieldId}-error`
  const quantityErrorId = `${quantityFieldId}-error`

  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<AssembleKitFormValues>({
    resolver: zodResolver(assembleKitSchema),
    mode: 'onChange',
  })

  const [recipeId, requestedQuantity] = useWatch({
    control,
    name: ['recipe_id', 'requested_quantity'],
  })
  const selectedRecipe = recipes.find((recipe) => recipe.recipe_id === recipeId)

  const onSubmit = (values: AssembleKitFormValues) => {
    createKit.mutate(values, { onSuccess: () => resetField('requested_quantity') })
  }

  return (
    <div className="space-y-5">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor={recipeFieldId} className="block text-sm font-medium text-slate-800">
            Receta
          </label>
          <select
            id={recipeFieldId}
            defaultValue=""
            aria-invalid={errors.recipe_id !== undefined}
            aria-describedby={errors.recipe_id !== undefined ? recipeErrorId : undefined}
            className={cn(fieldClass, errors.recipe_id ? 'border-rose-500' : 'border-slate-300')}
            {...register('recipe_id', { valueAsNumber: true, onChange: () => createKit.reset() })}
          >
            <option value="" disabled>
              Selecciona una receta…
            </option>
            {recipes.map((recipe) => (
              <option key={recipe.recipe_id} value={recipe.recipe_id}>
                {recipe.kit_code} · {recipe.description}
              </option>
            ))}
          </select>
          {errors.recipe_id !== undefined && (
            <p id={recipeErrorId} className="mt-1 text-sm text-rose-700">
              {errors.recipe_id.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={quantityFieldId} className="block text-sm font-medium text-slate-800">
            Cantidad solicitada
          </label>
          <input
            id={quantityFieldId}
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            aria-invalid={errors.requested_quantity !== undefined}
            aria-describedby={errors.requested_quantity !== undefined ? quantityErrorId : undefined}
            className={cn(
              fieldClass,
              errors.requested_quantity ? 'border-rose-500' : 'border-slate-300',
            )}
            {...register('requested_quantity', { valueAsNumber: true })}
          />
          {errors.requested_quantity !== undefined && (
            <p id={quantityErrorId} className="mt-1 text-sm text-rose-700">
              {errors.requested_quantity.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={createKit.isPending}
          loadingText="Armando…"
        >
          Armar kit
        </Button>
      </form>

      <div aria-live="polite">
        {createKit.isSuccess && (
          <Alert
            tone={isPartialAssembly(createKit.data.result) ? 'warning' : 'success'}
            title={isPartialAssembly(createKit.data.result) ? 'Armado parcial' : 'Kit armado'}
          >
            {createKit.data.message}
          </Alert>
        )}
      </div>
      {createKit.isError && <ApiErrorAlert error={toApiError(createKit.error)} />}

      <div className="border-t border-slate-200 pt-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">Previsualización</h3>
        <KitPreview
          recipe={selectedRecipe}
          requestedQuantity={requestedQuantity}
          items={items}
          availableByItem={availableByItem}
        />
      </div>
    </div>
  )
}
