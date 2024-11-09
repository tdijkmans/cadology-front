import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsTrophy } from '@ng-icons/lets-icons/regular';
import type { SkateActvitity } from '../../services/data.interface';

@Component({
  selector: 'activitieslist',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './activitieslist.component.html',
  styleUrl: './activitieslist.component.scss',
  viewProviders: [provideIcons({ letsTrophy })],
})
export class ActivitieslistComponent {
  @Input({ required: true }) currentActivity = {} as SkateActvitity;
  @Input({ required: true }) allActivities = [] as SkateActvitity[];
  @Output() selectActivity = new EventEmitter<SkateActvitity>();


  handleAct(activity: SkateActvitity) {
    this.selectActivity.emit(activity);
  }

  // In your component's .ts file
  isCurrentActivity(activity: SkateActvitity): boolean {
    return this.currentActivity?.activityId === activity.activityId;
  }

  isFastestSpeed(activity: SkateActvitity): boolean {
    const allSpeeds = this.allActivities.map((a) => a.activityDetails.stats?.fastestSpeed?.kph);
    const speeds = allSpeeds.filter((speed) => speed !== undefined);
    return activity.activityDetails.stats?.fastestSpeed?.kph === Math.max(...speeds);
  }

  isFastedLap(activity: SkateActvitity): boolean {
    const allLaps = this.allActivities.map((a) => Number.parseFloat(a.activityDetails.stats?.fastestTime || '0'));
    const laps = allLaps.filter((lap) => lap !== undefined);
    const lap = Number.parseFloat(activity.activityDetails.stats?.fastestTime || '0');
    return lap === Math.min(...laps);
  }

  isMostLaps(activity: SkateActvitity): boolean {
    const allLaps = this.allActivities.map((a) => a.activityDetails.stats?.lapCount);
    const laps = allLaps.filter((lap) => lap !== undefined);
    return activity.activityDetails.stats?.lapCount === Math.max(...laps);
  }

}
