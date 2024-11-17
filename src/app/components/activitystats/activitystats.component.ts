import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { letsArrowLeft, letsArrowRight } from "@ng-icons/lets-icons/regular";
import { StatisticsService } from "@services/statistics/statistics.service";
import type { Activity } from "../../services/dataservice/data.interface";
import { DataService } from "../../services/dataservice/data.service";

@Component({
  selector: "activitystats",
  standalone: true,
  imports: [CommonModule, NgIconComponent,],
  providers: [DataService, StatisticsService],
  templateUrl: "./activitystats.component.html",
  styleUrl: "./activitystats.component.scss",
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft })],
})
export class ActivitystatsComponent implements OnChanges {
  @Input({ required: true }) currentActivity = {} as Activity;
  @Input({ required: true }) isMostRecent = false;
  @Input({ required: true }) isOldest = false;
  @Output() nextActivity = new EventEmitter();
  @Output() prevActivity = new EventEmitter();

  totalDistance = 0;
  totalTrainingTime = ['0', 'uur'];

  constructor(private s: StatisticsService) {

  }

  onNext() {
    this.nextActivity.emit();
  }

  onPrevious() {
    this.prevActivity.emit();
  }

  ngOnChanges() {
    this.totalDistance = this.s.getDistance(this.currentActivity.laps.length);
    this.totalTrainingTime = this.s.getTotalTrainingTime(this.currentActivity.totalTrainingTime);
  }

}