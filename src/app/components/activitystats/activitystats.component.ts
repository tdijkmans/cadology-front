import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { letsArrowLeft, letsArrowRight } from "@ng-icons/lets-icons/regular";
import type { Activity } from "../../services/data.interface";
import { DataService } from "../../services/data.service";




@Component({
  selector: "activitystats",
  standalone: true,
  imports: [CommonModule, NgIconComponent,],
  providers: [DataService],
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
  TRACK_LENGTH = 0.38418 as const; // in km

  onNext() {
    this.nextActivity.emit();
  }

  onPrevious() {
    this.prevActivity.emit();
  }

  ngOnChanges() {
    this.totalDistance = this.TRACK_LENGTH * this.currentActivity.lapCount;
    this.totalTrainingTime = this.getTotalTrainingTime();
  }

  getTotalTrainingTime() {
    const time = this.currentActivity.totalTrainingTime?.split(".")[0];
    const numberOfColons = time?.split(":").length;
    return numberOfColons === 2 ? [time, 'minuten'] : [time, 'uur'];
  }
}