import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsArrowLeft, letsArrowRight } from '@ng-icons/lets-icons/regular';
import type {
  Activity,
  CurrentData,
} from '@services/dataservice/data.interface';
import { DataService } from '@services/dataservice/data.service';
import { StatisticsService } from '@services/statistics/statistics.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'cad-activitystats',
  standalone: true,
  imports: [CommonModule, NgIconComponent, CardComponent],
  providers: [StatisticsService],
  templateUrl: './activitystats.component.html',
  styleUrl: './activitystats.component.scss',
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft })],
})
export class ActivitystatsComponent {
  isMostRecent = false;
  isOldest = false;

  totalDistance = 0;
  totalTrainingTime = ['0', 'uur'];
  totalActivities = 0;
  currentActivity = {} as Activity;

  constructor(
    public d: DataService,
    public s: StatisticsService,
  ) {
    this.d.currentData$.subscribe((data) => {
      const [isMostRecent, isOldest] = this.identifyBoundaries(data);
      this.isMostRecent = isMostRecent;
      this.isOldest = isOldest;
    });
  }

  onNext() {
    this.d.navigateActivity('next').subscribe();
  }

  onPrevious() {
    this.d.navigateActivity('previous').subscribe();
  }

  identifyBoundaries(data: CurrentData) {
    const { curActivities, prevActivities, currentActivity } = data;
    this.currentActivity = currentActivity;
    const { laps, activityId, totalTrainingTime } = currentActivity;
    this.totalDistance = this.s.distanceFromLapCount(laps.length);
    this.totalTrainingTime = this.s.formattedTime(totalTrainingTime);
    const currentMostRecent = curActivities.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )[0];
    const currentOldest = prevActivities.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )[0];
    const isMostRecent = currentMostRecent.activityId === activityId;
    const isOldest = currentOldest?.activityId === activityId;
    return [isMostRecent, isOldest];
  }
}
