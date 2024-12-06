type Icon =
  | 'letsClock'
  | 'letsSpeed'
  | 'letsRoadAlt'
  | 'letsStat'
  | 'letsNotebook';

interface Tab {
  label?: string;
  value?: number;
  id: string;
  icon?: Icon;
}

export type { Tab };
