import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { letsArrowLeft, letsArrowRight } from "@ng-icons/lets-icons/regular";
import type { SkateActvitity } from "../../services/data.interface";
import { DataService } from "../../services/data.service";


@Component({
  selector: "activitystats",
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [DataService],
  templateUrl: "./activitystats.component.html",
  styleUrl: "./activitystats.component.scss",
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft })],
})
export class ActivitystatsComponent {
  @Input({ required: true }) currentActivity = {} as SkateActvitity;
  @Output() nextActivity = new EventEmitter();
  @Output() prevActivity = new EventEmitter();

  onNext() {
    this.nextActivity.emit();
  }

  onPrevious() {
    this.prevActivity.emit();
  }

  get totalTrainingTime() {
    const time = this.currentActivity.activityDetails.stats?.totalTrainingTime?.split(".")[0];
    const numberOfColons = time?.split(":").length;

    return numberOfColons === 2 ? [time, 'minuten'] : [time, 'uur'];
  }
}