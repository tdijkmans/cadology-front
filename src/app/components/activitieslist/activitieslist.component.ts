import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DatabadgeComponent } from '@components/databadge/databadge.component';
import { provideIcons } from '@ng-icons/core';
import { letsTrophy } from '@ng-icons/lets-icons/regular';
import type { Activity } from '../../services/dataservice/data.interface';

@Component({
  selector: 'activitieslist',
  standalone: true,
  imports: [CommonModule, DatabadgeComponent],
  templateUrl: './activitieslist.component.html',
  styleUrl: './activitieslist.component.scss',
  viewProviders: [provideIcons({ letsTrophy })],
})
export class ActivitieslistComponent implements OnChanges {
  @Input({ required: true }) currentActivity = {} as Activity;
  @Input({ required: true }) activities = [] as Activity[];
  @Output() selectActivity = new EventEmitter<Activity>();

  fastestId: number | null = null;
  fastestLapId: number | null = null;
  mostLapsId: number | null = null;

  activityStatuses: { [id: number]: { isCurrent: boolean; isFastestSpeed: boolean; isFastestLap: boolean; isMostLaps: boolean } } = {};

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

    this.fastestId = this.activities.reduce((prev, curr) =>
      (curr.bestLap.speed > prev.bestLap.speed ? curr : prev)).activityId;


    // To ignore tracks of length lower than 400m we use speed to identify the fastest lap
    //  250 meter track is thus ignored
    this.fastestLapId = this.activities.reduce((prev, curr) =>
      (curr.bestLap.speed < prev.bestLap.speed ? curr : prev)).activityId;

    this.mostLapsId = this.activities.reduce((prev, curr) =>
      (curr.lapCount > prev.lapCount ? curr : prev)).activityId;

  }


}
