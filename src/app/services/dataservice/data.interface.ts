interface Lap {
  lapNr: number;
  duration: number;
  speed: number;
  startTime: string; //ISO 8601 format
}

type Season = 'previousSeasonActivities' | 'currentSeasonActivities';
interface Activity {
  activityId: number;
  location: string;
  startTime: Date; //ISO 8601 format
  endTime: Date; //ISO 8601 format
  trackLength: number;
  bestLap: Lap;
  lapCount: number;
  totalTrainingTime: string;
  totalTrainingMinutes: number;
  averageSpeed: number;
  averageTime: number;
  medianTime: number;
  laps: Lap[];
  season: Season;
}

interface SeasonsResponse {
  data: Activity[];
  meta: { total: number; chipCode: string };
  type: Season;
}

interface Data {
  currentActivity: Activity;
  activities: Activity[];
}

interface CurrentData {
  currentActivity: Activity;
  curActivities: Activity[];
  prevActivities: Activity[];
}

type Status = 'loading' | 'loaded' | 'error';

export type {
  Activity,
  CurrentData,
  Data,
  Lap,
  Season,
  SeasonsResponse,
  Status,
};
