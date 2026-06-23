export type DashboardDonem = 'bugun' | '7gun' | '30gun';

export const DONEM_ETIKETLERI: { id: DashboardDonem; etiket: string }[] = [
  { id: 'bugun', etiket: 'Bugün' },
  { id: '7gun', etiket: '7 Gün' },
  { id: '30gun', etiket: '30 Gün' },
];
