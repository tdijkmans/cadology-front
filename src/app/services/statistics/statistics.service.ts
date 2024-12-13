import { Injectable } from '@angular/core';
import { CappedLap } from '@components/barchart/barchart.interface';
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
  readonly TRACK_LENGTH = 0.38418 as const;

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

  public prepareLapData(
    laps: Lap[],
    yScaleMax: number,
    type: 'speed' | 'lapTime',
    progressiveDelta = 0,
  ): CappedLap[] {
    const twoDecimal = (v: number) => Math.round(v * 100) / 100;

    let rollingSumSpeed = 0;
    let rollingSumLapTime = 0;

    // Process data, storing both capped and original values
    const lapData = laps.map((l, index) => {
      const speed = twoDecimal(l.speed);
      const lapTime = l.duration;

      rollingSumSpeed += speed;
      rollingSumLapTime += lapTime;

      const rollingAvgSpeed = twoDecimal(rollingSumSpeed / (index + 1));
      const rollingAvgLapTime = twoDecimal(rollingSumLapTime / (index + 1));

      const originalValue = type === 'speed' ? speed : lapTime;
      const isCapped = originalValue > yScaleMax;
      const isProgressive =
        index > 0 &&
        laps[index].speed + progressiveDelta > laps[index - 1].speed;

      return {
        isCapped,
        isProgressive,
        lapTime,
        name: `${index + 1}`,
        originalValue, // Uncapped value for display
        rollingAvgLapTime,
        rollingAvgSpeed,
        seq: index,
        speed,
        value: Math.min(originalValue, yScaleMax), // Capped value for display
      };
    });

    return lapData;
  }

  public identifyProgressiveStreak(laps: CappedLap[]) {
    const { longestStreak } = laps.reduce<{
      currentStreak: { value: number; laps: CappedLap[] };
      longestStreak: { value: number; laps: CappedLap[] };
    }>(
      (acc, lap) => {
        if (lap.isProgressive) {
          acc.currentStreak.laps.push(lap);
          acc.currentStreak.value += 1;

          if (acc.currentStreak.value > acc.longestStreak.value) {
            acc.longestStreak = { ...acc.currentStreak };
          }
        } else {
          acc.currentStreak = { value: 0, laps: [] };
        }
        return acc;
      },
      {
        currentStreak: { value: 0, laps: [] },
        longestStreak: { value: 0, laps: [] },
      },
    );

    // Prepend the first lap of the longest streak to the lapIds array for display
    const firstStreakLapId = longestStreak.laps[0].seq - 1;
    const firstStreakLap =
      laps.find((l) => l.seq === firstStreakLapId) || ({} as CappedLap);

    return [firstStreakLap, longestStreak.laps].flat();
  }
}
