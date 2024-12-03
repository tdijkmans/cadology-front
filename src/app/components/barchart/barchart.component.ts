import { Component, Input, type OnChanges } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  letsArrowLeft,
  letsArrowRight,
  letsSortDown,
  letsSortUp,
  letsTrophy,
} from "@ng-icons/lets-icons/regular";
import { type Color, NgxChartsModule } from "@swimlane/ngx-charts";
import { theme } from "../../../_variables";
import type { Lap } from "../../services/dataservice/data.interface";
import type { CappedLap } from "./barchart.interface";

@Component({
  selector: "cad-barchart",
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

  currentIndex = 0; // Index of the selected bar
  lapData: CappedLap[] = [];
  selectedLap: (typeof this.lapData)[0] | null = null;
  fastestLap: CappedLap | null = null;
  progressiveLaps: CappedLap[] = [];
  colors = this.updateColors();
  sortBy: "sequential" | "duration" = "sequential";
  scheme = { domain: [theme.secondarycolor] } as Color;

  ngOnChanges(): void {
    this.initializeData();
    this.selectFastesLap();
    this.identifyProgressiveStreak();
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

  identifyProgressiveStreak(delta = 0.1) {
    // Identify laps where each lap is faster than the previous by at least delta
    const progressiveLaps = this.lapData.map((lap, index) => {
      const previousLap = this.lapData[index - 1];
      const isProgressive = previousLap
        ? lap.originalValue - previousLap.originalValue < -delta
        : false;

      return { isProgressive, ...lap };
    });

    // Track the longest streak of progressive laps
    const { longestStreak } = progressiveLaps.reduce<{
      currentStreak: { value: number; lapIds: string[] };
      longestStreak: { value: number; lapIds: string[] };
    }>(
      (acc, lap) => {
        if (lap.isProgressive) {
          acc.currentStreak.lapIds.push(lap.name);
          acc.currentStreak.value += 1;

          if (acc.currentStreak.value > acc.longestStreak.value) {
            acc.longestStreak = { ...acc.currentStreak };
          }
        } else {
          acc.currentStreak = { value: 0, lapIds: [] };
        }
        return acc;
      },
      {
        currentStreak: { value: 0, lapIds: [] },
        longestStreak: { value: 0, lapIds: [] },
      },
    );

    console.log("Longest Progressive Streak:", longestStreak);

    // Save the progressive laps to the component's state or class property
    this.progressiveLaps = progressiveLaps;
  }

  onSelect(event: CappedLap): void {
    this.currentIndex = this.lapData.findIndex((l) => l.name === event.name);
    this.colors = this.updateColors();
    this.selectedLap = this.lapData[this.currentIndex];
  }

  updateColors() {
    return this.lapData.map((lap, index) => ({
      name: lap.name,
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
    if (this.lapData.length < 2) {
      console.error("No data to sort");
      return;
    }
    this.sortBy = this.sortBy === "sequential" ? "duration" : "sequential";
    const { name } = this.selectedLap || this.lapData[0];

    const results =
      this.sortBy === "sequential"
        ? [...this.lapData].sort((a, b) => a.seq - b.seq)
        : [...this.lapData].sort((a, b) => a.value - b.value);

    this.lapData = [...results];
    this.currentIndex = results.findIndex((l) => l.name === name);
  }
}
