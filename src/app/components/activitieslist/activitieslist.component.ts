import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatabadgeComponent } from '@components/databadge/databadge.component';
import { provideIcons } from '@ng-icons/core';
import { letsTrophy } from '@ng-icons/lets-icons/regular';
import { DataService } from '@services/dataservice/data.service';
import { UiService } from '@services/uiservice/ui.service';
import { Observable } from 'rxjs';
import type { Activity } from '../../services/dataservice/data.interface';

interface ActivityStatus {
  isCurrent: boolean;
  isFastestSpeed: boolean;
  isFastestLap: boolean;
  isMostLaps: boolean;
}

@Component({
  selector: 'cad-activitieslist',
  standalone: true,
  imports: [CommonModule, DatabadgeComponent],
  templateUrl: './activitieslist.component.html',
  styleUrl: './activitieslist.component.scss',
  viewProviders: [provideIcons({ letsTrophy })],
})
export class ActivitieslistComponent implements OnChanges {
  currentActivity$: Observable<Activity>;

  @Input({ required: true }) activities: Activity[] = [];

  fastestId: number | null = null;
  fastestLapId: number | null = null;
  mostLapsId: number | null = null;

  activityStatuses: ActivityStatus[] = [];

  constructor(
    public d: DataService,
    public ui: UiService,
  ) {
    this.currentActivity$ = this.d.currentActivity$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities']) {
      this.calculateAchievements(this.activities);
    }
  }

  public handleActivityClick(activity: Activity): void {
    this.d.setCurrentActivity(activity);
    this.ui.closeModal();
  }

  private calculateAchievements(activities: Activity[]): void {
    if (activities.length === 0) return;

    this.fastestId = activities.reduce((prev, curr) =>
      curr.bestLap.speed > prev.bestLap.speed ? curr : prev,
    ).activityId;

    // To ignore tracks of length lower than 400m we use speed to identify the fastest lap
    //  250 meter track is thus ignored
    this.fastestLapId = activities.reduce((prev, curr) =>
      curr.bestLap.speed < prev.bestLap.speed ? curr : prev,
    ).activityId;

    this.mostLapsId = activities.reduce((prev, curr) =>
      curr.lapCount > prev.lapCount ? curr : prev,
    ).activityId;
  }
}
