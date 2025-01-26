import { CommonModule } from '@angular/common';
import { Component, Input, type OnChanges } from '@angular/core';
import { Activity, StatisticsService } from '@services/index';
import { type Color, LineChartModule } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { theme } from '../../../_variables';
import { ChartcontainerComponent } from '../chart/chartcontainer/chartcontainer.component';
import { ChartheaderComponent } from '../chart/chartheader/chartheader.component';
import type { Result } from './histochart.interface';

@Component({
  selector: 'cad-histochart',
  imports: [
    LineChartModule,
    CommonModule,
    ChartheaderComponent,
    ChartcontainerComponent,
  ],
  templateUrl: './histochart.component.html',
  styleUrl: './histochart.component.scss',
})
export class HistochartComponent implements OnChanges {
  @Input({ required: true }) currentActivity: Activity | null = null;
  @Input({ required: true }) prevActivities: Activity[] = [];
  @Input({ required: true }) curActivities: Activity[] = [];

  curve = shape.curveMonotoneX;
  results = [{ name: '', series: [{ name: '', value: 0 }] }] as Result;
  scheme = {
    domain: [theme.accentcolor, theme.secondarycolor, theme.subtlecolor],
  } as Color;

  constructor(private s: StatisticsService) {}

  ngOnChanges() {
    if (!this.currentActivity?.laps) {
      return;
    }
    this.initializeData();
  }

  initializeData() {
    const curActivities = this.curActivities;
    const prevActivities = this.prevActivities;
    const currentActivity = this.currentActivity;

    const currentHisto = this.s
      .getBinnedData(currentActivity?.laps.map((lap) => lap.duration) ?? [])
      .map((lap) => ({
        name: `${lap.bin}`,
        value: lap.normalizedCount,
        customText: `${lap.bin} - ${lap.bin + 1} sec`,
      }));

    const currentSeasonHisto = this.s
      .getBinnedData(
        curActivities?.flatMap((a) => a.laps.map((lap) => lap.duration)) ?? [],
      )
      .map((lap) => ({
        name: `${lap.bin}`,
        value: lap.normalizedCount,
        customText: `${lap.bin} - ${lap.bin + 1} sec`,
      }));

    const previousSeasonHisto = this.s
      .getBinnedData(
        prevActivities?.flatMap((a) => a.laps.map((lap) => lap.duration)) ?? [],
      )
      .map((lap) => ({
        name: `${lap.bin}`,
        value: lap.normalizedCount,
        customText: `${lap.bin} - ${lap.bin + 1} sec`,
      }));

    this.results = [
      { name: 'Deze sessie', series: currentHisto },
      { name: 'Dit seizoen', series: currentSeasonHisto },
      { name: 'Vorig seizoen', series: previousSeasonHisto },
    ];
  }

  percentTickFormatting(val: number) {
    return `${Math.round(val)}%`;
  }
}
