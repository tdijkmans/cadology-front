import {
  Component,
  DestroyRef,
  Input,
  type OnChanges,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CappedLap } from '@components/barchart/barchart.interface';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  letsArrowLeft,
  letsArrowRight,
  letsLightningAlt,
  letsSortDown,
  letsSortUp,
  letsTrophy,
} from '@ng-icons/lets-icons/regular';
import { StatisticsService } from '@services/statistics/statistics.service';
import { UiService } from '@services/uiservice/ui.service';
import {
  BarVerticalComponent,
  type Color,
  LineChartModule,
  NgxChartsModule,
} from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { distinctUntilChanged, tap } from 'rxjs';
import { theme } from '../../../_variables';
import type { Lap } from '../../services/dataservice/data.interface';
import { ChartcontainerComponent } from '../chart/chartcontainer/chartcontainer.component';
import { ChartheaderComponent } from '../chart/chartheader/chartheader.component';
import { ChartnavigationComponent } from '../chart/chartnavigation/chartnavigation.component';

@Component({
  selector: 'cad-combochart',
  standalone: true,
  imports: [
    NgxChartsModule,
    NgIconComponent,
    ChartheaderComponent,
    ChartcontainerComponent,
    ChartcontainerComponent,
    ChartheaderComponent,
    ChartnavigationComponent,
    LineChartModule,
  ],
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
  templateUrl: './combochart.component.html',
  styleUrl: './combochart.component.scss',
})
export class CombochartComponent implements OnChanges, OnInit {
  private destroyRef = inject(DestroyRef);
  @Input({ required: true }) laps: Lap[] = [];
  @Input({ required: true }) type: 'speed' | 'lapTime' = 'lapTime';
  @Input({ required: true }) yScaleMax = 0;
  @Input({ required: true }) yScaleMin = 0;

  rollingLapData = [{ name: '', series: [{ name: 0, value: 0 }] }];
  schemeTwo = { domain: [theme.accentcolor] } as Color;
  curve = shape.curveMonotoneX;

  @ViewChild('barChart') barChart!: BarVerticalComponent;

  currentIndex = 0; // Index of the selected bar
  lapData: CappedLap[] = [];
  selectedLap: (typeof this.lapData)[0] | null = null;
  fastestLap: CappedLap | null = null;
  colors = this.updateColors();
  sortBy: 'sequential' | 'duration' = 'sequential';
  scheme = { domain: [theme.secondarycolor] } as Color;
  progressiveStreak = [] as CappedLap[];

  constructor(
    public ui: UiService,
    public s: StatisticsService,
  ) {}

  ngOnInit() {
    this.ui
      .getActiveTabId$('home')
      ?.pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        tap(() => this.barChart?.update()),
      )
      .subscribe();
  }

  ngOnChanges(): void {
    if (!this.laps?.length) {
      return;
    }

    const lapData = this.s.prepareLapData(this.laps, this.yScaleMax, this.type);
    this.lapData = lapData;
    this.progressiveStreak = this.s.identifyProgressiveStreak(lapData);
    this.selectFastesLap();
    this.mapRollingAvg(lapData);
  }

  mapRollingAvg(laps: CappedLap[]) {
    this.rollingLapData = [
      {
        name: 'Totale afstand',
        series: laps.map((d, i) => ({
          name: i,
          value:
            this.type === 'speed' ? d.rollingAvgSpeed : d.rollingAvgLapTime,
        })),
      },
    ];
  }

  selectFastesLap() {
    const fastestLap = this.lapData.reduce((prev, current) =>
      prev.speed > current.speed ? prev : current,
    );
    this.fastestLap = fastestLap;
    this.onSelect(fastestLap);
  }

  selectFirstOfLongestStreak() {
    this.onSelect(this.progressiveStreak[0]);
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
