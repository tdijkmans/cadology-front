export interface CappedLap {
  name: string;
  value: number;
  originalValue: number;
  isCapped: boolean;
  seq: number;
  speed: number;
  lapTime: number;
  isProgressive: boolean;
}
