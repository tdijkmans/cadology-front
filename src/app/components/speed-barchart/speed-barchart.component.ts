import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsArrowLeft, letsArrowRight } from '@ng-icons/lets-icons/regular';
import { type Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { theme } from '../../../_variables';
import type { SessionDto } from '../../models';


type Lap = { name: string; value: number; originalValue: number; isCapped: boolean };

@Component({
  selector: 'speed-barchart',
  standalone: true,
  imports: [NgxChartsModule, NgIconComponent],
  templateUrl: './speed-barchart.component.html',
  styleUrl: './speed-barchart.component.scss',
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft })],
})
export class SpeedBarchartComponent {
  @Input({ required: true }) sessions: SessionDto[] = [];

  currentIndex = 0;  // Index of the selected bar
  lapData: Lap[] = [];
  selectedLap: typeof this.lapData[0] | null = null;
  fastestLap: Lap | null = null;
  colors = this.updateColors();
  yScaleMax = 40;
  yScaleMin = 5;

  scheme = { domain: [theme.secondarycolor] } as Color;;

  ngOnChanges(): void {
    this.initializeData();
    this.selectFastesLap();
  }

  initializeData() {
    const laps = this.sessions.flatMap((session) => session.laps || []);
    const twoDecimal = (v: number) => Math.round(v * 100) / 100;

    const lapSpeeds = laps
      .map((lap) => lap.speed?.kph || 0)
      .map((v) => twoDecimal(v));

    // Process data, storing both capped and original values
    this.lapData = lapSpeeds.map((duration, index) => ({
      name: `${index + 1}`,
      value: Math.min(duration, this.yScaleMax),  // Capped value for display
      originalValue: duration,                    // Uncapped value for tooltip
      isCapped: duration > this.yScaleMax
    }));
  }

  selectFastesLap() {
    const fastestLap = this.lapData.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
    this.fastestLap = fastestLap;
    this.onSelect(fastestLap);
  }


  onSelect(event: Lap): void {
    this.currentIndex = this.lapData.findIndex((l) => l.name === event.name);
    this.colors = this.updateColors();
    this.selectedLap = this.lapData[this.currentIndex];
  }

  updateColors() {
    return this.lapData.map((data, index) => ({
      name: data.name,
      value: index === this.currentIndex ? theme.primarycolor : theme.secondarycolor
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
