import {
  Component,
  DestroyRef,
  Input,
  type OnChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  letsArrowLeft,
  letsArrowRight,
  letsLightningAlt,
  letsSortDown,
  letsSortUp,
  letsTrophy,
} from '@ng-icons/lets-icons/regular';
import { UiService } from '@services/uiservice/ui.service';
import {
  BarVerticalComponent,
  type Color,
  NgxChartsModule,
} from '@swimlane/ngx-charts';
import { distinctUntilChanged } from 'rxjs';
import { theme } from '../../../_variables';
import type { Lap } from '../../services/dataservice/data.interface';
import { ChartcontainerComponent } from '../chart/chartcontainer/chartcontainer.component';
import { ChartheaderComponent } from '../chart/chartheader/chartheader.component';
import { ChartnavigationComponent } from '../chart/chartnavigation/chartnavigation.component';
import type { CappedLap } from './barchart.interface';

@Component({
  selector: 'cad-barchart',
  standalone: true,
  imports: [
    NgxChartsModule,
    NgIconComponent,
    ChartheaderComponent,
    ChartcontainerComponent,
    ChartcontainerComponent,
    ChartheaderComponent,
    ChartnavigationComponent,
  ],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss',
  viewProviders: [
    provideIcons({
      letsArrowRight,
      letsArrowLeft,
      letsTrophy,
      letsSortUp,
      letsSortDown,
      letsLightningAlt,
    }),
  ],
  // providers: [UiService]
})
export class BarchartComponent implements OnChanges {
  private destroyRef = inject(DestroyRef);
  @Input({ required: true }) laps: Lap[] = [];
  @Input({ required: true }) type: 'speed' | 'lapTime' = 'lapTime';
  @Input({ required: true }) yScaleMax = 0;
  @Input({ required: true }) yScaleMin = 0;

  @ViewChild('barChart') barChart!: BarVerticalComponent;

  currentIndex = 0; // Index of the selected bar
  lapData: CappedLap[] = [];
  selectedLap: (typeof this.lapData)[0] | null = null;
  fastestLap: CappedLap | null = null;
  colors = this.updateColors();
  sortBy: 'sequential' | 'duration' = 'sequential';
  scheme = { domain: [theme.secondarycolor] } as Color;
  progressiveStreak = [] as CappedLap[];

  constructor(public ui: UiService) {}

  ngOnInit() {
    this.ui
      .getActiveTabId$('home')
      ?.pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe((t) => {
        this.barChart?.update();
      });
  }

  ngOnChanges(): void {
    if (!this.laps?.length) {
      return;
    }
    this.initializeData();
    this.progressiveStreak = this.identifyProgressiveStreak();
    this.selectFastesLap();
  }

  initializeData(progressiveDelta = 0) {
    const laps = this.laps;
    const twoDecimal = (v: number) => Math.round(v * 100) / 100;

    // Process data, storing both capped and original values
    const lapData = laps.map((l, index) => {
      const speed = twoDecimal(l.speed);
      const lapTime = l.duration;
      const originalValue = this.type === 'speed' ? speed : lapTime;
      const isCapped = originalValue > this.yScaleMax;
      const isProgressive =
        index > 0 &&
        laps[index].speed + progressiveDelta > laps[index - 1].speed;

      return {
        isProgressive,
        name: `${index + 1}`,
        value: Math.min(originalValue, this.yScaleMax), // Capped value for display
        originalValue, // Uncapped value for display
        isCapped,
        seq: index,
        speed,
        lapTime,
      };
    });

    this.lapData = lapData;
  }

  selectFastesLap() {
    console.log(' hoi');
    const fastestLap = this.lapData.reduce((prev, current) =>
      prev.speed > current.speed ? prev : current,
    );
    this.fastestLap = fastestLap;
    this.onSelect(fastestLap);
  }

  selectFirstOfLongestStreak() {
    this.onSelect(this.progressiveStreak[0]);
  }

  identifyProgressiveStreak() {
    const { longestStreak } = this.lapData.reduce<{
      currentStreak: { value: number; laps: CappedLap[] };
      longestStreak: { value: number; laps: CappedLap[] };
    }>(
      (acc, lap) => {
        if (lap.isProgressive) {
          acc.currentStreak.laps.push(lap);
          acc.currentStreak.value += 1;

          if (acc.currentStreak.value > acc.longestStreak.value) {
            acc.longestStreak = { ...acc.currentStreak };
          }
        } else {
          acc.currentStreak = { value: 0, laps: [] };
        }
        return acc;
      },
      {
        currentStreak: { value: 0, laps: [] },
        longestStreak: { value: 0, laps: [] },
      },
    );

    // Prepend the first lap of the longest streak to the lapIds array for display
    const firstStreakLapId = longestStreak.laps[0].seq - 1;
    const firstStreakLap =
      this.lapData.find((l) => l.seq === firstStreakLapId) || ({} as CappedLap);

    return [firstStreakLap, longestStreak.laps].flat();
  }

  onSelect(lap: CappedLap): void {
    this.currentIndex = this.lapData.findIndex((l) => l.name === lap.name);
    this.selectedLap = this.lapData[this.currentIndex];
    this.colors = this.updateColors();
  }

  updateColors() {
    const progressiveStreakIds =
      this.progressiveStreak?.map((l) => l.seq) || [];
    const fastestLapId = this.fastestLap?.name;

    const getColor = (index: number, lap: CappedLap) => {
      if (index === this.currentIndex) {
        return theme.primarycolor;
      }
      if (progressiveStreakIds.includes(lap.seq)) {
        return theme.warningcolor;
      }

      if (lap.name === fastestLapId) {
        return theme.successcolor;
      }
      return theme.secondarycolor;
    };

    return this.lapData.map((lap, index) => ({
      name: lap.name,
      value: getColor(index, lap),
    }));
  }

  selectNextBar() {
    this.currentIndex = (this.currentIndex + 1) % this.lapData.length;
    this.selectedLap = this.lapData[this.currentIndex];
    this.colors = this.updateColors();
  }

  selectPrevBar() {
    this.currentIndex =
      (this.currentIndex - 1 + this.lapData.length) % this.lapData.length;
    this.selectedLap = this.lapData[this.currentIndex];
    this.colors = this.updateColors();
  }

  toggleSort() {
    if (this.lapData.length < 2) {
      console.error('No data to sort');
      return;
    }
    this.sortBy = this.sortBy === 'sequential' ? 'duration' : 'sequential';
    const { name } = this.selectedLap || this.lapData[0];

    const results =
      this.sortBy === 'sequential'
        ? [...this.lapData].sort((a, b) => a.seq - b.seq)
        : [...this.lapData].sort((a, b) => a.value - b.value);

    this.lapData = [...results];
    this.currentIndex = results.findIndex((l) => l.name === name);
  }
}
