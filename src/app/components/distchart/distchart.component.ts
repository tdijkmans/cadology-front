import { CommonModule } from "@angular/common";
import { Component, Input, type OnChanges } from "@angular/core";
import { ChartcontainerComponent } from "@components/chart/chartcontainer/chartcontainer.component";
import { ChartheaderComponent } from "@components/chart/chartheader/chartheader.component";
import type { Activity } from "@services/dataservice/data.interface";
import { StatisticsService } from "@services/statistics/statistics.service";
import { type Color, LineChartModule } from "@swimlane/ngx-charts";
import * as shape from "d3-shape";
import { theme } from "../../../_variables";

@Component({
  selector: "cad-distchart",
  standalone: true,
  imports: [LineChartModule, CommonModule, ChartcontainerComponent, ChartcontainerComponent, ChartheaderComponent,],
  templateUrl: "./distchart.component.html",
  styleUrl: "./distchart.component.scss",
})
export class DistchartComponent implements OnChanges {
  @Input({ required: true }) currentActivity = {} as Activity;

  totalDistance = 0;
  totalTrainingTime = ['0', 'uur'];

  results = [{ name: "", series: [{ name: 0, value: 0 }] }];
  scheme = { domain: [theme.accentcolor] } as Color;
  curve = shape.curveMonotoneX;

  constructor(private s: StatisticsService) { }

  ngOnChanges(): void {

    this.initializeData();
  }

  initializeData() {
    const { laps, totalTrainingTime } = this.currentActivity;
    const cumulativeDistance = this.s.getCumulatingDistance(laps);
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
    this.totalDistance = this.s.distanceFromLapCount(laps.length);
    this.totalTrainingTime = this.s.formattedTime(totalTrainingTime);
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
