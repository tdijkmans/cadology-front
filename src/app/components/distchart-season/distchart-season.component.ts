import { CommonModule } from "@angular/common";
import { Component, Input, ViewChild } from "@angular/core";
import type { Activity } from "@services/dataservice/data.interface";
import { StatisticsService } from "@services/statistics/statistics.service";
import {
  type Color,
  type LineChartComponent,
  LineChartModule,
} from "@swimlane/ngx-charts";
import * as shape from "d3-shape";
import { theme } from "../../../_variables";

@Component({
  selector: "distchart-season",
  standalone: true,
  imports: [LineChartModule, CommonModule],
  templateUrl: "./distchart-season.component.html",
  styleUrl: "./distchart-season.component.scss",
})
export class DistchartSeasonComponent {
  @Input({ required: true }) currentActivity = {} as Activity;
  @Input({ required: true }) prevActivities: Activity[] = [];
  @Input({ required: true }) curActivities: Activity[] = [];
  @ViewChild("histoChart") chart: LineChartComponent | null = null;

  totalDistanceCur = 0;
  totalTrainingHrCur = 0;
  totalDistancePrev = 0;
  totalTrainingHrPrev = 0;

  results = [{ name: "", series: [{ name: 0, value: 0 }] }];
  scheme = { domain: [theme.secondarycolor, theme.subtlecolor] } as Color;
  curve = shape.curveBasis;

  constructor(private s: StatisticsService) { }

  ngOnChanges(): void {
    this.initializeData();
  }

  initializeData() {
    const cur = this.s.getCumulatingSeasonDistance(this.curActivities,);
    const prev = this.s.getCumulatingSeasonDistance(this.prevActivities,);

    this.totalDistanceCur = cur[cur.length - 1].cumulativeDistance;
    this.totalTrainingHrCur =
      cur[cur.length - 1].cumulativeTrainingMinutes / 60;
    this.totalDistancePrev = prev[prev.length - 1].cumulativeDistance;
    this.totalTrainingHrPrev =
      prev[prev.length - 1].cumulativeTrainingMinutes / 60;

    // one year in milliseconds (365 days) to normalize the x-axis
    const seasonDelta = 31536000000;

    this.results = [
      {
        name: "Totale afstand",
        series: cur.map((d, i) => ({
          name: d.time - seasonDelta,
          trueDate: d.time,
          value: d.cumulativeDistance,
          customText: `${d.lapCount} rondes`,
        })),
      },
      {
        name: "Totale afstand vorig seizoen",
        series: prev.map((d, i) => ({
          name: d.time,
          trueDate: d.time,
          value: d.cumulativeDistance,
          customText: `${d.lapCount} rondes`,
        })),
      },
    ];
  }

  xAxisTickFormatting = (date: number): string => {
    return new Date(date).toLocaleDateString("nl-NL", {
      month: "short",
      day: "numeric",
    });
  };

  yAxisTickFormatting = (distance: number): string => {
    return distance.toFixed(0);
  };
}
