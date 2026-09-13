export const CUISINES = [
  ['any', 'Any'],
  ['italian', 'Italian'],
  ['mexican', 'Mexican'],
  ['indian', 'Indian'],
  ['chinese', 'Chinese'],
  ['japanese', 'Japanese'],
  ['thai', 'Thai'],
  ['mediterranean', 'Mediterranean'],
  ['french', 'French'],
  ['korean', 'Korean'],
  ['american', 'American'],
]

export const INGREDIENT_TYPE_LABELS = {
  detected: 'Detected',
  pantry: 'Pantry',
  extra: 'Need to grab',
}

export function ingredientType(value) {
  return Object.hasOwn(INGREDIENT_TYPE_LABELS, value) ? value : 'extra'
}

export const PHASES = ['upload', 'ingredients', 'recipes']

export const STEPS = [
  {
    key: 'upload',
    number: '01',
    label: 'Show & tell',
    title: 'What are we working with?',
    description: 'Give the chef a quick look at today’s ingredients.',
  },
  {
    key: 'ingredients',
    number: '02',
    label: 'Roll call',
    title: 'Let’s make the cast list.',
    description: 'Fix the line-up, then pick a culinary mood.',
  },
  {
    key: 'recipes',
    number: '03',
    label: 'Make magic',
    title: 'Dinner has entered the chat.',
    description: 'Choose a recipe and let the good smells begin.',
  },
]
