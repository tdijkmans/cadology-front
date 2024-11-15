import { Injectable } from '@angular/core';

type Bin = { bin: number, count: number, normalizedCount: number };

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  public calculateHistogram(data: number[], binStart = 24, binEnd = 60, binWidth = 1): Bin[] {
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
      bin.normalizedCount = bin.count / totalCount;
    }

    return bins;

  }


}
