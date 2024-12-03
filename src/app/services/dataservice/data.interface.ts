type Lap = {
    lapNr: number;
    duration: number;
    speed: number;
    startTime: string; //ISO 8601 format
};



type Season = "previousSeasonActivities" | "currentSeasonActivities";
type Activity = {
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
};

type SeasonsResponse = {
    data: Activity[];
    meta: { total: number; chipCode: string };
    type: Season;
};

type Data = {
    currentActivity: Activity;
    activities: Activity[];
};

type CurrentData = {
    currentActivity: Activity;
    curActivities: Activity[];
    prevActivities: Activity[];
}


export type { Activity, CurrentData, Data, Lap, Season, SeasonsResponse };
