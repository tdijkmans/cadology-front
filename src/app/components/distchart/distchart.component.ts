import { CommonModule } from "@angular/common";
import { Component, Input, type OnChanges, ViewChild } from "@angular/core";
import type { Activity } from "@services/dataservice/data.interface";
import { StatisticsService } from "@services/statistics/statistics.service";
import { type Color, LineChartComponent, LineChartModule } from "@swimlane/ngx-charts";
import * as shape from "d3-shape";
import { theme } from "../../../_variables";
import type { ChartTabVariant } from "../../pages/home/home.interface";

@Component({
  selector: "distchart",
  standalone: true,
  imports: [LineChartModule, CommonModule],
  templateUrl: "./distchart.component.html",
  styleUrl: "./distchart.component.scss",
})
export class DistchartComponent implements OnChanges {
  @Input({ required: true }) currentActivity = {} as Activity;
  @Input({ required: true }) chartTab: ChartTabVariant = "distance";
  @ViewChild("distChart") chart: LineChartComponent | null = null;



  totalDistance = 0;
  totalTrainingTime = ['0', 'uur'];

  results = [{ name: "", series: [{ name: 0, value: 0 }] }];
  scheme = { domain: [theme.accentcolor] } as Color;
  curve = shape.curveMonotoneX;

  constructor(private s: StatisticsService) { }

  ngOnChanges(): void { this.initializeData(); }

  initializeData() {
    const cumulativeDistance = this.s.getCumulatingDistance(
      this.currentActivity?.laps ?? [],
    );
    this.results = [
      {
        name: "Totale afstand",
        series: cumulativeDistance.map((d, i) => ({
          name: d.time,
          value: d.cumulativeDistance,
          customText: `Ronde ${i + 1}`,
        })),
      },
    ];
    this.totalDistance = this.s.distanceFromLapCount(this.currentActivity.laps.length);
    this.totalTrainingTime = this.s.formattedTime(this.currentActivity.totalTrainingTime);
  }

  xAxisTickFormatting = (date: number): string => {
    return Intl.DateTimeFormat("nl-NL", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  yAxisTickFormatting = (distance: number): string => {
    return distance.toFixed(0)
  };
}
