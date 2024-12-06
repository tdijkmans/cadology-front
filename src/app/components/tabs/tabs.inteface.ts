type Icon =
  | 'letsClock'
  | 'letsSpeed'
  | 'letsRoadAlt'
  | 'letsStat'
  | 'letsNotebook';

type Tab = { label?: string; value?: number; id: string; icon?: Icon };

export type { Tab };
