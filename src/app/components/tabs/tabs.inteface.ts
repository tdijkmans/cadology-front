type Icon =
  | 'letsClock'
  | 'letsSpeed'
  | 'letsRoadAlt'
  | 'letsStat'
  | 'letsNotebook'
  | 'letsChartAlt';

interface Tab {
  label?: string;
  value?: number;
  id: string;
  icon?: Icon;
}

export type { Tab };
