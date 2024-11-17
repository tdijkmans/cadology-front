import { Injectable } from "@angular/core";
import { Lap } from "@services/dataservice/data.interface";

type Bin = { bin: number; count: number; normalizedCount: number };

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  public calculateHistogram(
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

  public calculateCumulativeDistance(
    laps: Lap[],
    lapLength = 0.38418,
  ): { time: number; cumulativeDistance: number }[] {
    let cumulativeDistance = 0;

    const quantifiedLaps = laps.map((lap) => {
      return { ...lap, startTime: new Date(lap.startTime).getTime() };
    });

    return quantifiedLaps
      .sort((a, b) => a.startTime - b.startTime)
      .map((lap, i) => {
        cumulativeDistance += lapLength;
        return {
          time: lap.startTime,
          cumulativeDistance: Math.round(cumulativeDistance * 100) / 100,
        };
      });
  }

  getTotalTrainingTime(totalTrainingTime: string | undefined) {
    if (!totalTrainingTime) {
      return ["0", "uur"];
    }
    const time = totalTrainingTime?.split(".")[0];
    const numberOfColons = time?.split(":").length;
    return numberOfColons === 2 ? [time, "minuten"] : [time, "uur"];
  }

  getDistance(lapCount: number, TRACK_LENGTH = 0.38418) {
    return TRACK_LENGTH * lapCount;
  }
}
