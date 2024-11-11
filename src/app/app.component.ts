import { CommonModule } from "@angular/common";
import { Component, DestroyRef, type OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { provideIcons } from "@ng-icons/core";
import { letsEye, letsTrophy } from "@ng-icons/lets-icons/regular";
import { BehaviorSubject, mergeMap, tap } from "rxjs";
import { ActivitieslistComponent } from "./components/activitieslist/activitieslist.component";
import { ActivitystatsComponent } from "./components/activitystats/activitystats.component";
import { LapBarchartComponent } from "./components/lap-barchart/lap-barchart.component";
import { SpeedBarchartComponent } from "./components/speed-barchart/speed-barchart.component";
import type { SkateActvitity } from "./services/data.interface";
import { DataService } from "./services/data.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ActivitystatsComponent,
    ActivitieslistComponent,
    LapBarchartComponent,
    SpeedBarchartComponent
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],
  viewProviders: [provideIcons({ letsEye, letsTrophy })],
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  title = "";
  chipInput = "";
  errorMessage = "";
  isMenuOpen = new BehaviorSubject(false);

  constructor(private dataService: DataService) { }

  ngOnInit() {
    const chipCode = this.dataService.getItem<string>("chipCode");

    if (chipCode) {
      this.chipInput = chipCode;
      this.fetchCurrentActivities(chipCode);
    } else {
      this.errorMessage = "Vul een chipcode in";
      this.dataService.removeItem("chipCode");
    }
  }

  get allActivities$() {
    return this.dataService.allActivities$;
  }

  get currentActivity$() {
    return this.dataService.currentActivity$;
  }

  fetchCurrentActivities(chipCode: string) {
    this.dataService
      .getCurrentSeasonActivities({ chipCode })
      .pipe(
        mergeMap((currentActivities) => {
          this.dataService.setCurrentActivity(currentActivities[0]);
          this.dataService.setAllActivities(currentActivities);

          return this.dataService
            .getPreviousSeasonActivities({ chipCode })
            .pipe(
              tap((previousActivities) => {
                // Combine current and previous activities
                const allActivities = [
                  ...currentActivities,
                  ...previousActivities,
                ];
                const sortedActivities = allActivities.sort(
                  (a, b) => {
                    if (a?.startTime && b?.startTime) {
                      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
                    }
                    return 0;

                  }
                );
                this.dataService.setAllActivities(sortedActivities);
              }),
            );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      return;
    }
    this.errorMessage = "";
    this.fetchCurrentActivities(chipCode);
    this.dataService.setItem("chipCode", chipCode);
  }

  handleAct(activity: SkateActvitity) {
    this.dataService.setCurrentActivity(activity);
  }

  selectNextActivity() {
    this.dataService
      .navigateActivity("next")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  selectPrevActivity() {
    this.dataService
      .navigateActivity("previous")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  clearCache() {
    this.dataService.clearLocalStorage();
  }

  toggleMenu() {
    this.isMenuOpen.next(!this.isMenuOpen.value);
    console.log("toggleMenu", this.isMenuOpen.value);
  }

}
