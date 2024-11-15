import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import type { Activity } from "@services/dataservice/data.interface";
import { StatisticsService } from "@services/statistics/statistics.service";
import { type Color, LineChartModule } from "@swimlane/ngx-charts";
import * as shape from "d3-shape";
import { theme } from "../../../_variables";

type Result = { name: string; series: { name: string; value: number }[] }[];

@Component({
  selector: "histochart",
  standalone: true,
  imports: [LineChartModule, CommonModule],
  templateUrl: "./histochart.component.html",
  styleUrl: "./histochart.component.scss",
})
export class HistochartComponent {
  @Input({ required: true }) currentActivity: Activity | null = null;
  @Input({ required: true }) previousSeasonActivities: Activity[] = [];
  @Input({ required: true }) currentSeasonActivities: Activity[] = [];

  curve = shape.curveBasis;
  results = [{ name: "", series: [{ name: "", value: 0 }] }] as Result;
  scheme = {
    domain: [theme.accentcolor, theme.secondarycolor, theme.subtlecolor],
  } as Color;

  constructor(private s: StatisticsService) { }

  ngOnChanges(): void {
    this.initializeData();
  }

  initializeData() {
    const currentSeasonActivities = this.currentSeasonActivities;
    const previousSeasonActivities = this.previousSeasonActivities;
    const currentActivity = this.currentActivity;

    const currentHisto = this.s
      .calculateHistogram(
        currentActivity?.laps.map((lap) => lap.duration) ?? [],
      )
      .map((lap) => ({
        name: `${lap.bin}`,
        value: lap.normalizedCount,
      }));

    const currentSeasonHisto = this.s
      .calculateHistogram(
        currentSeasonActivities?.flatMap((a) =>
          a.laps.map((lap) => lap.duration),
        ) ?? [],
      )
      .map((lap) => ({
        name: `${lap.bin}`,
        value: lap.normalizedCount,
      }));

    const previousSeasonHisto = this.s
      .calculateHistogram(
        previousSeasonActivities?.flatMap((a) =>
          a.laps.map((lap) => lap.duration),
        ) ?? [],
      )
      .map((lap) => ({
        name: `${lap.bin}`,
        value: lap.normalizedCount,
      }));

    this.results = [
      { name: "Deze sessie", series: currentHisto },
      { name: "Dit seizoen", series: currentSeasonHisto },
      { name: "Vorig seizoen", series: previousSeasonHisto },
    ];
  }

  percentTickFormatting(val: number) {
    return `${Math.round(val * 100)}%`;
  }
}
