import type { AssembledKit, ReceptionItem, Recipe } from '../../api/schemas.ts'

/** Initial data returned by the real backend (GET items and GET recipes). */
export const receptionItems: ReceptionItem[] = [
  {
    item_id: 1,
    code: '5010054265',
    description: 'Pata de apoyo',
    item_type: 'COMPONENT',
    counted_quantity: 6,
    cost: 3.0,
    issues: [],
  },
  {
    item_id: 2,
    code: '5091176586',
    description: 'Eje pata doble',
    item_type: 'COMPONENT',
    counted_quantity: 6,
    cost: 1.0,
    issues: [],
  },
  {
    item_id: 3,
    code: '5091377768',
    description: 'Resorte',
    item_type: 'COMPONENT',
    counted_quantity: 12,
    cost: 0.5,
    issues: [{ type: 'DAÑADO', quantity: 2, observation: 'Oxidados' }],
  },
  {
    item_id: 4,
    code: '0204050052F',
    description: 'Pastilla freno',
    item_type: 'LOOSE',
    counted_quantity: 395,
    cost: 0.59,
    issues: [],
  },
]

export const kitEpdRecipe: Recipe = {
  recipe_id: 10,
  kit_item_id: 100,
  kit_code: 'KIT-EPD',
  description: 'Kit eje pata doble',
  parts: [
    { item_id: 1, quantity: 1 },
    { item_id: 2, quantity: 1 },
    { item_id: 3, quantity: 2 },
  ],
}

export const kitPatRecipe: Recipe = {
  recipe_id: 11,
  kit_item_id: 101,
  kit_code: 'KIT-PAT',
  description: 'Kit pata con resortes',
  parts: [
    { item_id: 1, quantity: 1 },
    { item_id: 3, quantity: 4 },
  ],
}

export const recipes: Recipe[] = [kitEpdRecipe, kitPatRecipe]

/** Real backend response for POST { recipe_id: 10, requested_quantity: 10 }: only 5 assembled. */
export const partialEpdKit: AssembledKit = {
  assembly_id: '91eb8a9d',
  recipe_id: 10,
  kit_item_id: 100,
  kit_code: 'KIT-EPD',
  description: 'Kit eje pata doble',
  requested_quantity: 10,
  assembled_quantity: 5,
  unit_cost: 5.0,
  total_cost: 25.0,
  notice: 'Se solicitaron 10 kit(s), pero solo alcanzaron piezas disponibles para armar 5.',
}

/** A complete assembly: 2 KIT-PAT requested and assembled. */
export const fullPatKit: AssembledKit = {
  assembly_id: 'a1b2c3d4',
  recipe_id: 11,
  kit_item_id: 101,
  kit_code: 'KIT-PAT',
  description: 'Kit pata con resortes',
  requested_quantity: 2,
  assembled_quantity: 2,
  unit_cost: 5.0,
  total_cost: 10.0,
  notice: null,
}
