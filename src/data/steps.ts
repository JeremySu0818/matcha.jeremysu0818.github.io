export type Step = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
  align: 'left' | 'right' | 'center';
};

export const steps: Step[] = [
  {
    id: 'intro',
    title: 'Matcha',
    body: 'Scroll. Whisk. Sip.',
    align: 'center',
  },
  {
    id: 'powder',
    eyebrow: 'Step 1',
    title: 'Add matcha powder.',
    body: 'A soft fall of fine green particles gathers in the bowl.',
    align: 'right',
  },
  {
    id: 'sift',
    eyebrow: 'Step 2',
    title: 'Fine powder, smoother foam.',
    body: 'A sieve refines the texture before water touches the tea.',
    align: 'left',
  },
  {
    id: 'water',
    eyebrow: 'Step 3',
    title: 'Add warm water at 75°C.',
    body: 'A clean stream opens the aroma without burning the powder.',
    align: 'right',
  },
  {
    id: 'whisk',
    eyebrow: 'Step 4',
    title: 'Whisk in a quick W motion.',
    body: 'The chasen moves fast and shallow until the surface turns soft.',
    align: 'left',
  },
  {
    id: 'finish',
    title: 'Final Recipe',
    body: 'Make your own matcha ritual.',
    align: 'center',
  },
];
