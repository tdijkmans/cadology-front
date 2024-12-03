import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { letsArrowLeft, letsArrowRight } from "@ng-icons/lets-icons/regular";
import type { Activity, CurrentData } from "@services/dataservice/data.interface";
import { DataService } from "@services/dataservice/data.service";
import { StatisticsService } from "@services/statistics/statistics.service";

@Component({
  selector: "activitystats",
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [StatisticsService],
  templateUrl: "./activitystats.component.html",
  styleUrl: "./activitystats.component.scss",
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft })],
})
export class ActivitystatsComponent {
  isMostRecent = false;
  isOldest = false;

  totalDistance = 0;
  totalTrainingTime = ["0", "uur"];
  totalActivities = 0;
  currentActivity = {} as Activity;

  constructor(public d: DataService) {
    this.d.currentData$.subscribe((data) => {
      this.identifyBoundaries(data);
    });
  }

  onNext() {
    this.d.navigateActivity("next").subscribe();
  }

  onPrevious() {
    this.d.navigateActivity("previous").subscribe();
  }

  identifyBoundaries(data: CurrentData) {
    this.currentActivity = data.currentActivity;
    const mostRecent = data.curActivities;
    const oldest = data.prevActivities;
    const currentMostRecent = mostRecent.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )[0];
    const currentOldest = oldest.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )[0];
    this.isMostRecent =
      currentMostRecent.activityId === this.currentActivity.activityId;
    this.isOldest =
      currentOldest.activityId === this.currentActivity.activityId;
  }
}
