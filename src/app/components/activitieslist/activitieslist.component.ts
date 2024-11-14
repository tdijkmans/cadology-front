import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsTrophy } from '@ng-icons/lets-icons/regular';
import type { Activity } from '../../services/data.interface';

@Component({
  selector: 'activitieslist',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './activitieslist.component.html',
  styleUrl: './activitieslist.component.scss',
  viewProviders: [provideIcons({ letsTrophy })],
})
export class ActivitieslistComponent implements OnChanges {
  @Input({ required: true }) currentActivity = {} as Activity;
  @Input({ required: true }) activities = [] as Activity[];
  @Output() selectActivity = new EventEmitter<Activity>();

  fastestSpeedActivityId: number | null = null;
  fastestLapActivityId: number | null = null;
  mostLapsActivityId: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities']) {
      this.calculateAchievements();
    }
  }

  handleAct(activity: Activity) {
    this.selectActivity.emit(activity);
  }

  isCurrentActivity(activity: Activity): boolean {
    return this.currentActivity?.activityId === activity.activityId;
  }

  private calculateAchievements(): void {
    if (this.activities.length === 0) return;

    this.fastestSpeedActivityId = this.activities.reduce((prev, curr) =>
      (curr.bestLap.speed > prev.bestLap.speed ? curr : prev)).activityId;


    this.mostLapsActivityId = this.activities.reduce((prev, curr) =>
      (curr.lapCount > prev.lapCount ? curr : prev)).activityId;

  }

  isFastestSpeed(activity: Activity): boolean {
    return activity.activityId === this.fastestSpeedActivityId;
  }

  // Fastest lap equals the highest speed; if determined by time, we would need to consider the track length (i.e. 400 vs 250m)
  isFastestLap(activity: Activity): boolean {
    return activity.activityId === this.fastestSpeedActivityId;
  }

  isMostLaps(activity: Activity): boolean {
    return activity.activityId === this.mostLapsActivityId;
  }
}
