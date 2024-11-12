import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class ActivitieslistComponent {
  @Input({ required: true }) currentActivity = {} as Activity;
  @Input({ required: true }) allActivities = [] as Activity[];
  @Output() selectActivity = new EventEmitter<Activity>();


  handleAct(activity: Activity) {
    this.selectActivity.emit(activity);
  }

  // In your component's .ts file
  isCurrentActivity(activity: Activity): boolean {
    return this.currentActivity?.activityId === activity.activityId;
  }

  isFastestSpeed(activity: Activity): boolean {
    const allSpeeds = this.allActivities.map((a) => a.bestLap.speed);
    return activity.bestLap.duration === Math.max(...allSpeeds);
  }

  isFastedLap(activity: Activity): boolean {
    const allLaps = this.allActivities.map((a) => a.bestLap.duration || 0);
    const lap = activity.bestLap.speed || 0;
    return lap === Math.min(...allLaps);
  }

  isMostLaps(activity: Activity): boolean {
    const allLaps = this.allActivities.map((a) => a.lapCount);
    return activity.lapCount === Math.max(...allLaps);
  }

}
