import { CommonModule } from "@angular/common";
import { Component, DestroyRef, type OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivitieslistComponent } from "@components/activitieslist/activitieslist.component";
import { ActivitystatsComponent } from "@components/activitystats/activitystats.component";
import { BarchartComponent } from "@components/barchart/barchart.component";
import { CircleBadgeComponent } from "@components/circle-badge/circle-badge.component";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { letsArrowLeft, letsArrowRight, letsSettingLine } from "@ng-icons/lets-icons/regular";
import { DataService } from "@services/data.service";
import { filter, mergeMap, of, tap } from "rxjs";
import type { Activity } from "./services/data.interface";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ActivitystatsComponent,
    ActivitieslistComponent,
    NgIconComponent,
    CircleBadgeComponent,
    BarchartComponent
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],
  viewProviders: [provideIcons({ letsArrowRight, letsArrowLeft, letsSettingLine })],
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  title = "";
  chipInput = "";
  errorMessage = "";
  leftMenuOpen = false;
  rightMenuOpen = false;
  chartTabVariant: 'speed' | 'lapTime' = 'lapTime';
  seasonTabVariant: 'current' | 'previous' = 'current';

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

  get currentSeasonActivities$() {
    return this.dataService.allActivities$.pipe(
      filter(activities => !!activities),
      mergeMap((activities) =>
        of(activities.filter((a) => a.season === "currentSeasonActivities"))));
  }

  get previousSeasonActivities$() {
    return this.dataService.allActivities$.pipe(
      filter(activities => !!activities),
      mergeMap((activities) =>
        of(activities.filter((a) => a.season === "previousSeasonActivities"))));
  }

  fetchCurrentActivities(chipCode: string) {
    this.dataService
      .getCurrentSeasonActivities({ chipCode })
      .pipe(
        mergeMap((currentActivities) => {

          this.dataService.setCurrentActivity(currentActivities.data[0]);
          this.dataService.setAllActivities(currentActivities.data);

          return this.dataService
            .getPreviousSeasonActivities({ chipCode })
            .pipe(
              tap((previousActivities) => {
                // Combine current and previous activities
                const allActivities = [
                  ...currentActivities.data,
                  ...previousActivities.data ?? [],
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

  handleAct(activity: Activity) {
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
    this.leftMenuOpen = !this.leftMenuOpen;
  }

  toggleRightMenu() {
    this.rightMenuOpen = !this.rightMenuOpen;
  }

  setTab(tab: 'speed' | 'lapTime') {
    this.chartTabVariant = tab;
  }

  setSeasonTab(tab: 'current' | 'previous') {
    this.seasonTabVariant = tab;
  }

}
