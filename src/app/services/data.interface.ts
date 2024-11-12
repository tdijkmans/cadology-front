type Activity = {
    activityId: number;
    location: string;
    startTime: Date; //ISO 8601 format
    endTime: Date; //ISO 8601 format
    trackLength: number;
    bestLap: BestLap;
    lapCount: number;
    totalTrainingTime: string;
    averageSpeed: number;
    averageTime: number;
    medianTime: number;
    laps: Lap[];
};

type Lap = {
    lapNr: number;
    duration: number;
    speed: number;
};

type BestLap = {
    lapNr: number;
    duration: number;
    speed: number;
};

type SeasonsResponse = {
    data: Activity[];
    meta: { total: number, chipCode: string };
    type: 'previousSeasonActivities' | 'currentSeasonActivities';
}


export type { Activity, BestLap, Lap, SeasonsResponse };
