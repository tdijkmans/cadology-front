import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import type { Activity } from '@services/dataservice/data.interface';
import { StatisticsService } from '@services/index';
import { type Color, LineChartModule } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { theme } from '../../../_variables';
import { ChartcontainerComponent } from '../chart/chartcontainer/chartcontainer.component';
import { ChartheaderComponent } from '../chart/chartheader/chartheader.component';

@Component({
  selector: 'cad-distchart-season',
  imports: [
    LineChartModule,
    CommonModule,
    ChartcontainerComponent,
    ChartheaderComponent,
  ],
  templateUrl: './distchart-season.component.html',
  styleUrl: './distchart-season.component.scss',
})
export class DistchartSeasonComponent implements OnChanges {
  @Input({ required: true }) currentActivity = {} as Activity;
  @Input({ required: true }) prevActivities: Activity[] = [];
  @Input({ required: true }) curActivities: Activity[] = [];

  totalDistanceCur = 0;
  totalTrainingHrCur = 0;
  totalDistancePrev = 0;
  totalTrainingHrPrev = 0;

  results = [{ name: '', series: [{ name: 0, value: 0 }] }];
  scheme = { domain: [theme.secondarycolor, theme.subtlecolor] } as Color;
  curve = shape.curveBasis;

  constructor(private s: StatisticsService) {}

  ngOnChanges(): void {
    this.initializeData();
  }

  initializeData() {
    if (this.curActivities?.length <= 0) {
      return;
    }
    const cur = this.s.getCumulatingSeasonDistance(this.curActivities);
    const prev = this.s.getCumulatingSeasonDistance(this.prevActivities);

    this.totalDistanceCur = cur[cur.length - 1]?.cumulativeDistance;
    this.totalTrainingHrCur =
      cur[cur.length - 1].cumulativeTrainingMinutes / 60;
    this.totalDistancePrev = prev[prev.length - 1]?.cumulativeDistance;
    this.totalTrainingHrPrev =
      prev[prev.length - 1]?.cumulativeTrainingMinutes / 60;

    // one year in milliseconds (365 days) to normalize the x-axis
    const seasonDelta = 31536000000;

    this.results = [
      {
        name: 'Totale afstand',
        series: cur.map((d) => ({
          name: d.time - seasonDelta,
          trueDate: d.time,
          value: d.cumulativeDistance,
          customText: `${d.lapCount} rondes`,
        })),
      },
      {
        name: 'Totale afstand vorig seizoen',
        series: prev.map((d) => ({
          name: d.time,
          trueDate: d.time,
          value: d.cumulativeDistance,
          customText: `${d.lapCount} rondes`,
        })),
      },
    ];
  }

  xAxisTickFormatting = (date: number): string => {
    return new Date(date).toLocaleDateString('nl-NL', {
      month: 'short',
      day: 'numeric',
    });
  };

  yAxisTickFormatting = (distance: number): string => {
    return distance.toFixed(0);
  };
}
