// Reads a recipe step's own wording to decide what to show beside it in cooking
// mode: which technique it mostly is, and any time or temperature it mentions.
// Nothing here calls a model; recipes arrive as plain text and this is a
// keyword read of that text.

// Listed in tie-break order: when two techniques match equally, the earlier wins.
const TECHNIQUES = [
  { key: 'serve', label: 'Serve', words: /\b(serve|plate|garnish|spoon)\b/gi },
  { key: 'oven', label: 'Roast', words: /\b(preheat|oven|roast|bake|broil|baking sheet|sheet pan)\b/gi },
  { key: 'grill', label: 'Grill', words: /\b(grill|skewers?|char|charred|barbecue)\b/gi },
  { key: 'boil', label: 'Boil', words: /\b(boil|blanch|parboil|drain)\b/gi },
  { key: 'simmer', label: 'Simmer', words: /\b(simmer|stew|braise|cover|reduce)\b/gi },
  { key: 'pan', label: 'Sear', words: /\b(sear|brown|saut[eé]|fry|skillet|wok|stir-fry)\b/gi },
  { key: 'knife', label: 'Prep', words: /\b(chop|dice|slice|cut|mince|halve|quarter|peel|trim)\b/gi },
  { key: 'bowl', label: 'Mix', words: /\b(toss|mix|whisk|stir|combine|marinate|season|drizzle)\b/gi },
]

const FALLBACK = { key: 'bowl', label: 'Cook' }

const TIME = /(\d+(?:\s*[-–]\s*\d+)?)\s*(minutes?|mins?|hours?|hrs?|seconds?|secs?)\b/i
const TEMPERATURE = /(\d{2,3})\s*°\s*([FC])(?:\s*\(\s*(\d{2,3})\s*°\s*([FC])\s*\))?/i

const UNIT = { m: 'min', h: 'hr', s: 'sec' }

export function describeStep(instruction = '') {
  let best = null
  let bestHits = 0
  for (const technique of TECHNIQUES) {
    const hits = instruction.match(technique.words)?.length ?? 0
    if (hits > bestHits) {
      best = technique
      bestHits = hits
    }
  }

  const time = instruction.match(TIME)
  const temperature = instruction.match(TEMPERATURE)

  return {
    technique: (best ?? FALLBACK).key,
    label: (best ?? FALLBACK).label,
    time: time ? `${time[1].replace(/\s*[-–]\s*/, '–')} ${UNIT[time[2][0].toLowerCase()]}` : null,
    temperature: temperature
      ? `${temperature[1]}°${temperature[2].toUpperCase()}` +
        (temperature[3] ? ` / ${temperature[3]}°${temperature[4].toUpperCase()}` : '')
      : null,
  }
}
