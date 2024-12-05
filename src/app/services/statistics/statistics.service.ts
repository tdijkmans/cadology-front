import { Injectable } from '@angular/core';
import { Activity, Lap } from '@services/dataservice/data.interface';

interface Bin {
  bin: number;
  count: number;
  normalizedCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  TRACK_LENGTH = 0.38418 as const;

  public getBinnedData(
    data: number[],
    binStart = 24,
    binEnd = 60,
    binWidth = 1,
  ): Bin[] {
    const bins: Bin[] = [];
    const totalCount = data.length;

    for (let i = binStart; i < binEnd; i += binWidth) {
      bins.push({ bin: i, count: 0, normalizedCount: 0 });
    }

    for (const value of data) {
      const binIndex = Math.floor((value - binStart) / binWidth);
      if (binIndex >= 0 && binIndex < bins.length) {
        bins[binIndex].count++;
      }
    }

    for (const bin of bins) {
      const normalizedCount = bin.count / totalCount;
      // Round to 1 decimal place
      const roundedNormalizedCount = Math.round(normalizedCount * 1000) / 10;
      bin.normalizedCount = roundedNormalizedCount;
    }

    return bins;
  }

  public getCumulatingDistance(
    laps: Lap[],
  ): { time: number; cumulativeDistance: number }[] {
    let cumulativeDistance = 0;

    const quantifiedLaps = laps.map((lap) => {
      return { ...lap, startTime: new Date(lap.startTime).getTime() };
    });

    return quantifiedLaps
      .sort((a, b) => a.startTime - b.startTime)
      .map((lap) => {
        cumulativeDistance += this.TRACK_LENGTH;
        return {
          time: lap.startTime,
          cumulativeDistance: Math.round(cumulativeDistance * 100) / 100,
        };
      });
  }

  public getCumulatingSeasonDistance(season: Activity[]) {
    let cumulativeDistance = 0;
    let cumulativeLapCount = 0;
    let cumulativeTrainingMinutes = 0;

    const quantifiedSeason = season.map((activity) => {
      return { ...activity, time: new Date(activity.startTime).getTime() };
    });

    return quantifiedSeason
      .sort((a, b) => a.time - b.time)
      .map((activity) => {
        cumulativeDistance += this.TRACK_LENGTH * activity.lapCount;
        cumulativeDistance = Math.round(cumulativeDistance * 100) / 100;
        cumulativeLapCount += activity.lapCount;
        cumulativeTrainingMinutes += activity.totalTrainingMinutes;

        return {
          time: activity.time,
          cumulativeDistance,
          cumulativeLapCount,
          startTime: activity.startTime,
          lapCount: activity.lapCount,
          cumulativeTrainingMinutes,
        };
      });
  }

  public formattedTime(totalTrainingTime: string | undefined) {
    if (!totalTrainingTime) {
      return ['0', 'uur'];
    }
    const time = totalTrainingTime?.split('.')[0];
    const numberOfColons = time?.split(':').length;
    return numberOfColons === 2 ? [time, 'minuten'] : [time, 'uur'];
  }

  public distanceFromLapCount(lapCount: number) {
    return this.TRACK_LENGTH * lapCount;
  }
}
