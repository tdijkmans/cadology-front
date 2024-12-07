import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatabadgeComponent } from '@components/databadge/databadge.component';
import { provideIcons } from '@ng-icons/core';
import { letsTrophy } from '@ng-icons/lets-icons/regular';
import { DataService } from '@services/dataservice/data.service';
import { UiService } from '@services/uiservice/ui.service';
import { Observable } from 'rxjs';
import type { Activity } from '../../services/dataservice/data.interface';
import { CardComponent } from '../card/card.component';
import { StatisticsService } from '@services/statistics/statistics.service';

interface ActivityStatus {
  isCurrent: boolean;
  isFastestSpeed: boolean;
  isFastestLap: boolean;
  isMostLaps: boolean;
}

@Component({
  selector: 'cad-activitieslist',
  standalone: true,
  imports: [CommonModule, DatabadgeComponent, CardComponent],
  templateUrl: './activitieslist.component.html',
  styleUrl: './activitieslist.component.scss',
  viewProviders: [provideIcons({ letsTrophy })],
})
export class ActivitieslistComponent implements OnChanges {
  currentActivity$: Observable<Activity>;

  @Input({ required: true }) activities: Activity[] = [];

  fastestId?: number;
  fastestLapId?: number;
  mostLapsId?: number;

  activityStatuses: ActivityStatus[] = [];

  constructor(
    public d: DataService,
    public ui: UiService,
    public s: StatisticsService,
  ) {
    this.currentActivity$ = this.d.currentActivity$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities']) {
      const achievements = this.s.calculateAchievements(this.activities);
      this.fastestLapId = achievements?.fastestLapId;
      this.fastestId = achievements?.fastestId;
      this.mostLapsId = achievements?.mostLapsId;
    }
  }

  public handleActivityClick(activity: Activity): void {
    this.d.setCurrentActivity(activity);
    this.ui.closeModal();
  }
}
