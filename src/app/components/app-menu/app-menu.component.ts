import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivitieslistComponent } from "@components/activitieslist/activitieslist.component";
import { CircleBadgeComponent } from "@components/circle-badge/circle-badge.component";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  letsArrowLeft,
  letsArrowRight,
  letsCalendar,
  letsMenu,
} from "@ng-icons/lets-icons/regular";
import type { SeasonTabVariant } from "@pages/home/home.interface";
import type { Activity } from "@services/dataservice/data.interface";
import { DataService } from "@services/dataservice/data.service";
import { UiService } from "@services/uiservice/ui.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-menu",
  standalone: true,
  viewProviders: [
    provideIcons({ letsArrowRight, letsArrowLeft, letsMenu, letsCalendar }),
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgIconComponent,
    CommonModule,
    ActivitieslistComponent,
    CircleBadgeComponent,
    NgIconComponent,
  ],
  templateUrl: "./app-menu.component.html",
  styleUrl: "./app-menu.component.scss",
})
export class AppMenuComponent {
  private destroyRef = inject(DestroyRef);
  chipInput = "";
  errorMessage = "";
  seasonTab = new BehaviorSubject<SeasonTabVariant>("current");

  constructor(
    public d: DataService,
    public ui: UiService,
  ) {
    this.chipInput = this.d.getItem<string>("chipCode") || "";
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  clearCache() {
    this.d.clearLocalStorage();
  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      return;
    }
    this.errorMessage = "";
    // Initialize with the chipCode from the form
    this.d.init(chipCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  handleAct(activity: Activity) {
    console.log("Setting current activity from menu", activity);
  }

  setSeasonTab(tab: SeasonTabVariant) {
    this.seasonTab.next(tab);
  }
}
