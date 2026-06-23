export interface TranslationSchema {
  metadata: {
    title: string;
    description: string;
  };
  header: {
    title: string;
  };
  nav: {
    home: string;
    scene3d: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    scroll: string;
  };
  chapters: {
    chapter1: ChapterCopy;
    chapter2: ChapterCopy;
    chapter3: ChapterCopy;
    chapter4: ChapterCopy;
    chapter5: ChapterCopy;
  };
  final: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    button: string;
  };
  loader: {
    preparing: string;
  };
  overlay: {
    ritual: string;
    finalRecipe: string;
    matcha: string;
    warmWater: string;
    waterTemp: string;
    back: string;
    replay: string;
  };
  sceneMode: {
    label: string;
    scroll: string;
    manual: string;
  };
  steps: {
    intro: StepCopy;
    powder: EyebrowStepCopy;
    sift: EyebrowStepCopy;
    water: EyebrowStepCopy;
    whisk: EyebrowStepCopy;
    finish: StepCopy;
  };
  manualTutorial: {
    sieveDrag: string;
    sieveReady: string;
    sieveReturn: string;
    kettleDrag: string;
    kettleReady: string;
    kettleReturn: string;
    chasenDrag: string;
    whisking: string;
    done: string;
  };
}

export interface ToolsCopy {
  title: string;
  desc: string;
  clickToView: string;
  close3D: string;
  loading: string;
  interactionHint: string;
  tools: ToolCopy[];
}

export interface ShadeCopy {
  shadeTitle: string;
  shadeDesc: string;
  shadeSunlight: string;
  shadeFull: string;
  chlorophyll: string;
  theanine: string;
  catechin: string;
  shadeStateSun: string;
  shadeStateMed: string;
  shadeStateFull: string;
}

export interface CalculatorCopy {
  nav: string;
  eyebrow: string;
  title: string;
  description: string;
  teaType: string;
  types: Record<"koicha" | "usucha" | "latte", string>;
  servingAndStrength: string;
  ratioSettings: string;
  serving: string;
  concentration: string;
  teaMilkRatio: string;
  temperatureSettings: string;
  targetTemperature: string;
  coldTemperature: string;
  hotTemperature: string;
  recipe: string;
  matchaPowder: string;
  water: string;
  milk: string;
  waterMix: string;
  hotWater: string;
  coldWater: string;
  light: string;
  strong: string;
  moreMilk: string;
  moreTea: string;
  reset: string;
}

export interface LocaleCopy {
  translation: TranslationSchema;
  tools: ToolsCopy;
  shade: ShadeCopy;
  calculator: CalculatorCopy;
}

interface ChapterCopy {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
  p3: string;
}

interface StepCopy {
  title: string;
  body: string;
}

interface EyebrowStepCopy extends StepCopy {
  eyebrow: string;
}

interface ToolCopy {
  id: "chawan" | "chasen" | "chashaku";
  name: string;
  desc: string;
  modelSrc: string;
  scale: number;
}
