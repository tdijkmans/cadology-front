import { Component, Input, type OnChanges, ViewChild } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  letsArrowLeft,
  letsArrowRight,
  letsSortDown,
  letsSortUp,
  letsTrophy,
} from "@ng-icons/lets-icons/regular";
import {
  type BarVerticalComponent,
  type Color,
  NgxChartsModule,
} from "@swimlane/ngx-charts";
import { theme } from "../../../_variables";
import type { ChartTabVariant } from "../../app.interface";
import type { Lap } from "../../services/dataservice/data.interface";
import type { CappedLap } from "./barchart.interface";


@Component({
  selector: "barchart",
  standalone: true,
  imports: [NgxChartsModule, NgIconComponent],
  templateUrl: "./barchart.component.html",
  styleUrl: "./barchart.component.scss",
  viewProviders: [
    provideIcons({
      letsArrowRight,
      letsArrowLeft,
      letsTrophy,
      letsSortUp,
      letsSortDown,
    }),
  ],
})
export class BarchartComponent implements OnChanges {
  @Input({ required: true }) laps: Lap[] = [];
  @Input({ required: true }) type: "speed" | "lapTime" = "lapTime";
  @Input({ required: true }) yScaleMax = 0;
  @Input({ required: true }) yScaleMin = 0;
  @Input({ required: true }) chartTabVariant: ChartTabVariant = "distance";
  @ViewChild("histoChart") chart: BarchartComponent | null = null;


  @ViewChild("barChart") barChart: BarVerticalComponent | null = null;

  currentIndex = 0; // Index of the selected bar
  lapData: CappedLap[] = [];
  selectedLap: (typeof this.lapData)[0] | null = null;
  fastestLap: CappedLap | null = null;
  colors = this.updateColors();
  sortBy: "sequential" | "duration" = "sequential";
  scheme = { domain: [theme.secondarycolor] } as Color;

  ngOnChanges(): void {
    this.initializeData();
    this.selectFastesLap();
    this.barChart?.update();

  }

  initializeData() {
    const laps = this.laps;
    const twoDecimal = (v: number) => Math.round(v * 100) / 100;

    // Process data, storing both capped and original values
    this.lapData = laps.map((l, index) => {
      const speed = twoDecimal(l.speed);
      const lapTime = l.duration;
      const originalValue = this.type === "speed" ? speed : lapTime;
      const isCapped = originalValue > this.yScaleMax;

      return {
        name: `${index + 1}`,
        value: Math.min(originalValue, this.yScaleMax), // Capped value for display
        originalValue, // Uncapped value for display
        isCapped,
        seq: index,
        speed,
        lapTime,
      };
    });
  }

  selectFastesLap() {
    const fastestLap = this.lapData.reduce((prev, current) =>
      prev.speed > current.speed ? prev : current,
    );
    this.fastestLap = fastestLap;
    this.onSelect(fastestLap);
  }

  onSelect(event: CappedLap): void {
    this.currentIndex = this.lapData.findIndex((l) => l.name === event.name);
    this.colors = this.updateColors();
    this.selectedLap = this.lapData[this.currentIndex];
  }

  updateColors() {
    return this.lapData.map((data, index) => ({
      name: data.name,
      value:
        index === this.currentIndex ? theme.primarycolor : theme.secondarycolor,
    }));
  }

  selectNextBar() {
    this.currentIndex = (this.currentIndex + 1) % this.lapData.length;
    this.colors = this.updateColors();
    this.selectedLap = this.lapData[this.currentIndex];
  }

  selectPrevBar() {
    this.currentIndex =
      (this.currentIndex - 1 + this.lapData.length) % this.lapData.length;
    this.colors = this.updateColors();
    this.selectedLap = this.lapData[this.currentIndex];
  }

  toggleSort() {
    if (this.lapData.length < 2 || !this.barChart) { return; }
    this.sortBy = this.sortBy === "sequential" ? "duration" : "sequential";
    const { name } = this.selectedLap || this.lapData[0];

    const results =
      this.sortBy === "sequential"
        ? [...this.lapData].sort((a, b) => a.seq - b.seq)
        : [...this.lapData].sort((a, b) => a.value - b.value);

    this.lapData = [...results];
    this.barChart.results = results;
    this.currentIndex = results.findIndex((l) => l.name === name);
    this.barChart.update();
  }
}
