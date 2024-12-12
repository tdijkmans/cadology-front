type Icon =
  | 'letsClock'
  | 'letsSpeed'
  | 'letsRoadAlt'
  | 'letsStat'
  | 'letsNotebook'
  | 'letsChartAlt'
  | 'letsPen';

interface Tab {
  label?: string;
  value?: number;
  id: string;
  icon?: Icon;
}

export type { Tab };
