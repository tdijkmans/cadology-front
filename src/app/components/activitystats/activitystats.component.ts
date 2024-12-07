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
  imports: [CommonModule, NgIconComponent],
  providers: [StatisticsService],
  templateUrl: './activitystats.component.html',
  styleUrl: './activitystats.component.scss',
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft })],
})
export class ActivitystatsComponent {
  isMostRecent = false;
  isOldest = false;
  isFastest = false;
  isFastestLap = false;
  isLongest = false;

  totalDistance = 0;
  totalTrainingTime = ['0', 'uur'];
  totalActivities = 0;
  currentActivity = {} as Activity;

  constructor(
    public d: DataService,
    public s: StatisticsService,
  ) {
    this.d.currentData$.subscribe((data) => {
      this.identifyBoundaries(data);
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

    this.isMostRecent = curActivities[0].activityId === activityId;
    this.isOldest = prevActivities[0].activityId === activityId;

    const current = this.s.calculateAchievements(curActivities);
    const previous = this.s.calculateAchievements(prevActivities);
    this.isFastest =
      current?.fastestId === activityId || previous?.fastestId === activityId;
    this.isLongest =
      current?.mostLapsId === activityId || previous?.mostLapsId === activityId;
    this.isFastestLap =
      current?.fastestLapId === activityId ||
      previous?.fastestLapId === activityId;
  }
}
