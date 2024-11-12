import { Component, Input, type OnChanges } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsArrowLeft, letsArrowRight } from '@ng-icons/lets-icons/regular';
import { type Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { theme } from '../../../_variables';
import type { Lap } from '../../services/data.interface';



type CappedLap = { name: string; value: number; originalValue: number; isCapped: boolean };

@Component({
  selector: 'lap-barchart',
  standalone: true,
  imports: [NgxChartsModule, NgIconComponent],
  templateUrl: './lap-barchart.component.html',
  styleUrl: './lap-barchart.component.scss',
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft })],
})
export class LapBarchartComponent implements OnChanges {
  @Input({ required: true }) laps: Lap[] = [];

  currentIndex = 0;  // Index of the selected bar
  lapData: CappedLap[] = [];
  selectedLap: typeof this.lapData[0] | null = null;
  fastestLap: CappedLap | null = null;
  colors = this.updateColors();
  yScaleMax = 100;
  yScaleMin = 25;

  scheme = { domain: [theme.primarycolor] } as Color;;

  ngOnChanges(): void {
    this.initializeData();
    this.selectFastesLap();
  }

  initializeData() {

    const lapDurations = this.laps.map((lap) => lap.duration);

    // Process data, storing both capped and original values
    this.lapData = lapDurations.map((duration, index) => ({
      name: `${index + 1}`,
      value: Math.min(duration, this.yScaleMax),  // Capped value for display
      originalValue: duration,                    // Uncapped value for tooltip
      isCapped: duration > this.yScaleMax
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
}
