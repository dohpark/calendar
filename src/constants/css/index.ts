export const fractions = {
  '1/4': 'grid-cols-1/4',
  '1/3': 'grid-cols-1/3',
  '1/2': 'grid-cols-1/2',
  '2/3': 'grid-cols-2/3',
  '3/4': 'grid-cols-3/4',
  'auto-start': 'grid-cols-auto-start',
  'auto-end': 'grid-cols-auto-end',
} as const;

export const gaps = {
  '0': `gap-0`,
  '1': `gap-1`,
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '7': 'gap-7',
  '8': 'gap-8',
} as const;

export const justifyContents = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
  stretch: 'justify-stretch',
} as const;

export const alignItems = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
} as const;
