// Demo data lets every screen render for a live walkthrough even if the
// backend is unreachable. Enable with VITE_DEMO=1 or by visiting ?demo=1.
export const DEMO_MODE =
  import.meta.env.VITE_DEMO === '1' ||
  (typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('demo'))

export const DEMO_IMAGE = '/demo-ingredients.png'

export const DEMO_ITEMS = ['chicken', 'peppers', 'potatoes', 'tomato']

export const DEMO_RECIPES = [
  {
    title: 'Chicken and Pepper Stew with Roasted Potatoes',
    summary:
      'A hearty, comforting stew featuring tender chicken and sweet peppers in a rich tomato sauce, served alongside crispy roasted potatoes.',
    servings: 4,
    total_time_minutes: 75,
    difficulty: 'Medium',
    ingredients: [
      { item: 'chicken thighs, bone-in and skin-on', quantity: '1.5 pounds', type: 'detected' },
      { item: 'bell peppers, sliced', quantity: '2 medium', type: 'detected' },
      { item: 'tomatoes, diced', quantity: '2 cups', type: 'detected' },
      { item: 'potatoes, cut into 1-inch cubes', quantity: '1.5 pounds', type: 'detected' },
      { item: 'onion, chopped', quantity: '1 medium', type: 'extra' },
      { item: 'garlic cloves, minced', quantity: '3 cloves', type: 'extra' },
      { item: 'olive oil', quantity: '3 tablespoons', type: 'pantry' },
      { item: 'chicken broth', quantity: '1 cup', type: 'pantry' },
      { item: 'paprika', quantity: '1 teaspoon', type: 'pantry' },
      { item: 'salt', quantity: 'to taste', type: 'pantry' },
      { item: 'black pepper', quantity: 'to taste', type: 'pantry' },
      { item: 'dried thyme', quantity: '1 teaspoon', type: 'pantry' },
    ],
    equipment: ['oven', 'large skillet', 'baking sheet', 'mixing bowl', 'knife', 'cutting board'],
    steps: [
      {
        n: 1,
        instruction:
          'Preheat oven to 425°F (220°C). Toss potato cubes with 1 tablespoon olive oil, salt, and pepper. Spread on a baking sheet and roast until golden and crispy, about 30-35 minutes.',
        tip: 'Turn potatoes halfway through roasting for even browning.',
      },
      {
        n: 2,
        instruction:
          'While potatoes roast, heat 2 tablespoons olive oil in a large skillet over medium-high heat. Season chicken thighs with salt, pepper, and paprika. Brown chicken skin-side down until deeply golden, about 5-6 minutes per side. Remove and set aside.',
        tip: 'Do not overcrowd the pan to get a good sear on the chicken.',
      },
      {
        n: 3,
        instruction:
          'In the same skillet, add chopped onion and garlic. Sauté until softened and fragrant, about 3 minutes.',
        tip: 'Scrape browned bits from the pan to add flavor.',
      },
      {
        n: 4,
        instruction:
          'Add sliced peppers and cook until slightly softened, about 5 minutes. Stir in diced tomatoes, chicken broth, and thyme. Bring to a simmer.',
        tip: 'Simmer gently to develop flavors without breaking down the peppers too much.',
      },
      {
        n: 5,
        instruction:
          'Return chicken thighs to the skillet, skin side up. Cover and simmer on low heat for 25 minutes, until chicken is cooked through and tender.',
        tip: 'Check internal temperature of chicken reaches 165°F (74°C) for safety.',
      },
      {
        n: 6,
        instruction: 'Serve the chicken and pepper stew hot with roasted potatoes on the side.',
        tip: 'Spoon some stew sauce over the potatoes for extra flavor.',
      },
    ],
    chef_tips: [
      'Use bone-in chicken thighs for more flavor and juiciness.',
      'Roasting potatoes at high heat ensures a crispy exterior and fluffy interior.',
      'Simmering the stew gently allows flavors to meld without overcooking vegetables.',
    ],
    level_up: 'Add a splash of white wine or a pinch of smoked paprika to the stew for deeper complexity.',
  },
  {
    title: 'Grilled Chicken and Pepper Skewers with Tomato Potato Salad',
    summary:
      'A fresh and vibrant meal featuring marinated grilled chicken and peppers on skewers, paired with a tangy tomato and potato salad.',
    servings: 4,
    total_time_minutes: 50,
    difficulty: 'Medium',
    ingredients: [
      { item: 'chicken breast, cubed', quantity: '1.5 pounds', type: 'detected' },
      { item: 'bell peppers, chunked', quantity: '2 large', type: 'detected' },
      { item: 'cherry tomatoes', quantity: '2 cups', type: 'detected' },
      { item: 'baby potatoes', quantity: '1 pound', type: 'detected' },
      { item: 'red onion', quantity: '1 small', type: 'extra' },
      { item: 'lemon', quantity: '1', type: 'extra' },
      { item: 'olive oil', quantity: '4 tablespoons', type: 'pantry' },
      { item: 'oregano', quantity: '1 teaspoon', type: 'pantry' },
    ],
    equipment: ['grill', 'skewers', 'pot', 'mixing bowl'],
    steps: [
      { n: 1, instruction: 'Boil baby potatoes until fork-tender, about 15 minutes, then halve.', tip: 'Salt the water generously.' },
      { n: 2, instruction: 'Marinate cubed chicken and pepper chunks in olive oil, lemon, and oregano for 15 minutes.', tip: '' },
      { n: 3, instruction: 'Thread chicken and peppers onto skewers and grill over medium-high heat, turning, for 12-15 minutes.', tip: 'Grill until lightly charred and cooked through.' },
      { n: 4, instruction: 'Toss potatoes, tomatoes, and red onion with lemon and olive oil. Serve alongside the skewers.', tip: '' },
    ],
    chef_tips: ['Soak wooden skewers so they do not burn.', 'Char the peppers for a smoky note.'],
    level_up: 'Finish the salad with crumbled feta and fresh herbs.',
  },
  {
    title: 'One-Pan Chicken with Tomato Pepper Potato Bake',
    summary:
      'An easy baked dish where chicken, potatoes, peppers, and tomatoes cook together in one pan, resulting in a flavorful, juicy meal with minimal cleanup.',
    servings: 4,
    total_time_minutes: 60,
    difficulty: 'Easy',
    ingredients: [
      { item: 'chicken thighs', quantity: '4 pieces', type: 'detected' },
      { item: 'bell peppers, sliced', quantity: '2 medium', type: 'detected' },
      { item: 'tomatoes, quartered', quantity: '3 medium', type: 'detected' },
      { item: 'potatoes, wedged', quantity: '1.25 pounds', type: 'detected' },
      { item: 'garlic', quantity: '4 cloves', type: 'extra' },
      { item: 'olive oil', quantity: '3 tablespoons', type: 'pantry' },
      { item: 'italian seasoning', quantity: '1 tablespoon', type: 'pantry' },
    ],
    equipment: ['oven', 'sheet pan', 'knife', 'cutting board'],
    steps: [
      { n: 1, instruction: 'Preheat oven to 400°F (205°C). Arrange potatoes, peppers, tomatoes, and garlic on a sheet pan.', tip: '' },
      { n: 2, instruction: 'Nestle chicken thighs among the vegetables. Drizzle with olive oil and season everything.', tip: 'Pat chicken dry for crispier skin.' },
      { n: 3, instruction: 'Roast for 40-45 minutes until chicken is golden and vegetables are tender.', tip: '' },
    ],
    chef_tips: ['Cut potatoes small so they finish with the chicken.'],
    level_up: 'Add olives and a squeeze of lemon in the last 5 minutes.',
  },
]
