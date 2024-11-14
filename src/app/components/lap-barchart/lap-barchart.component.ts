import { Component, Input, type OnChanges, ViewChild } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsArrowLeft, letsArrowRight, letsSortDown, letsSortUp, letsTrophy } from '@ng-icons/lets-icons/regular';
import { type BarVerticalComponent, type Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { theme } from '../../../_variables';
import type { Lap } from '../../services/data.interface';

export type CappedLap = { name: string; value: number; originalValue: number; isCapped: boolean, seq: number };

@Component({
  selector: 'lap-barchart',
  standalone: true,
  imports: [NgxChartsModule, NgIconComponent],
  templateUrl: './lap-barchart.component.html',
  styleUrl: './lap-barchart.component.scss',
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft, letsTrophy, letsSortUp, letsSortDown })],
})
export class LapBarchartComponent implements OnChanges {
  @Input({ required: true }) laps: Lap[] = [];

  @ViewChild('barChart') barChart: BarVerticalComponent | null = null;

  currentIndex = 0;  // Index of the selected bar
  lapData: CappedLap[] = [];
  selectedLap: typeof this.lapData[0] | null = null;
  fastestLap: CappedLap | null = null;
  colors = this.updateColors();
  yScaleMax = 100;
  yScaleMin = 25;
  sortBy: 'sequential' | 'duration' = 'sequential';

  scheme = { domain: [theme.primarycolor] } as Color;;

  ngOnChanges(): void {
    this.initializeData();
    this.selectFastesLap();
  }

  initializeData() {

    // Process data, storing both capped and original values
    this.lapData = this.laps.map((l, index) => ({
      name: `${index + 1}`,
      value: Math.min(l.duration, this.yScaleMax),  // Capped value for display
      originalValue: l.duration,                    // Uncapped value for tooltip
      isCapped: l.duration > this.yScaleMax,
      seq: index
    }));
  }

  selectFastesLap() {
    const fastestLap = this.lapData.reduce((prev, current) =>
      prev.value < current.value ? prev : current
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
      value: index === this.currentIndex ? theme.secondarycolor : theme.primarycolor
    }));
  }

  selectNextBar() {
    this.currentIndex = (this.currentIndex + 1) % this.lapData.length;
    this.colors = this.updateColors();
    this.selectedLap = this.lapData[this.currentIndex];
  }

  selectPrevBar() {
    this.currentIndex = (this.currentIndex - 1 + this.lapData.length) % this.lapData.length;
    this.colors = this.updateColors();
    this.selectedLap = this.lapData[this.currentIndex];
  }

  toggleSort() {
    if (this.lapData.length < 2 || !this.barChart) {
      return;
    }
    this.sortBy = this.sortBy === 'sequential' ? 'duration' : 'sequential';
    const { name } = this.selectedLap || this.lapData[0];

    const results = this.sortBy === 'sequential'
      ? [...this.lapData].sort((a, b) => a.seq - b.seq)
      : [...this.lapData].sort((a, b) => a.value - b.value);

    this.lapData = [...results];
    this.barChart.results = results;
    this.currentIndex = results.findIndex((l) => l.name === name);
    this.barChart.update();
  }


}
