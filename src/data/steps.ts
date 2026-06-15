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
    title: '一期一會',
    body: '放下繁雜，跟隨節奏，見證一碗茶的誕生。',
    align: 'center',
  },
  {
    id: 'powder',
    eyebrow: 'Step 01',
    title: '落粉',
    body: '細緻的翠綠粉末盛於篩網之中，懸於茶碗之上，靜靜等待開始。',
    align: 'right',
  },
  {
    id: 'sift',
    eyebrow: 'Step 02',
    title: '過篩',
    body: '在注水之前，讓茶粉濾得更為細緻，這是為了後續能打出綿密泡沫的講究。',
    align: 'left',
  },
  {
    id: 'water',
    eyebrow: 'Step 03',
    title: '注水',
    body: '以 75 度的溫水緩緩注入，喚醒茶香，而不燙傷茶粉。',
    align: 'right',
  },
  {
    id: 'whisk',
    eyebrow: 'Step 04',
    title: '擊拂',
    body: '用茶筅以 W 字型快速來回刷動，直到表面浮現如絲絨般的細密泡沫。',
    align: 'left',
  },
  {
    id: 'finish',
    title: '屬於你的時刻',
    body: '這就是屬於你的抹茶儀式。放慢腳步，好好享受這一刻的寧靜與甘甜。',
    align: 'center',
  },
];
