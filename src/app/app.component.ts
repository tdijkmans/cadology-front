import { CommonModule } from "@angular/common";
import { Component, DestroyRef, type OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivitieslistComponent } from "@components/activitieslist/activitieslist.component";
import { ActivitystatsComponent } from "@components/activitystats/activitystats.component";
import { BarchartComponent } from "@components/barchart/barchart.component";
import { CircleBadgeComponent } from "@components/circle-badge/circle-badge.component";
import { HistochartComponent } from "@components/histochart/histochart.component";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  letsArrowLeft,
  letsArrowRight,
  letsSettingLine,
} from "@ng-icons/lets-icons/regular";
import { DataService } from "@services/dataservice/data.service";
import { type Observable, filter, map } from "rxjs";
import type { ChartTabVariant, SeasonTabVariant } from "./app.interface";
import { DistchartComponent } from "./components/distchart/distchart.component";
import type { Activity } from "./services/dataservice/data.interface";

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
    BarchartComponent,
    HistochartComponent,
    DistchartComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],
  viewProviders: [
    provideIcons({ letsArrowRight, letsArrowLeft, letsSettingLine }),
  ],
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  title = "";
  chipInput = "";
  errorMessage = "";
  leftMenuOpen = false;
  rightMenuOpen = false;
  chartTabVariant: ChartTabVariant = "lapTime";
  seasonTabVariant: SeasonTabVariant = "current";

  allActivities$: Observable<Activity[] | null>;
  currentActivity$: Observable<Activity | null>;
  currentSeasonActivities$: Observable<Activity[] | null>;
  previousSeasonActivities$: Observable<Activity[] | null>;

  constructor(private d: DataService,) {
    this.allActivities$ = this.d.allActivities$;
    this.currentActivity$ = this.d.currentActivity$;

    const seasonActivities$ = this.d.allActivities$.pipe(
      filter((a) => a !== null),
      map((a) => ({
        currentSeasonActivities: a.filter((a) => a.season === "currentSeasonActivities"),
        previousSeasonActivities: a.filter((a) => a.season === "previousSeasonActivities"),
      }))
    );

    this.currentSeasonActivities$ = seasonActivities$.pipe(map((a) => a.currentSeasonActivities));
    this.previousSeasonActivities$ = seasonActivities$.pipe(map((a) => a.previousSeasonActivities));

  }

  ngOnInit() {
    const chipCode = this.d.getItem<string>("chipCode");

    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      this.d.removeItem("chipCode");
      return;
    }

    this.chipInput = chipCode;
    this.d.init(chipCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      return;
    }
    this.errorMessage = "";
    this.d.init(chipCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.d.setItem("chipCode", chipCode);
  }

  handleAct(activity: Activity) {
    this.d.setCurrentActivity(activity);
  }

  selectNextActivity() {
    this.d
      .navigateActivity("next")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  selectPrevActivity() {
    this.d
      .navigateActivity("previous")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  clearCache() {
    this.d.clearLocalStorage();
  }

  toggleMenu() {
    this.leftMenuOpen = !this.leftMenuOpen;
  }

  toggleRightMenu() {
    this.rightMenuOpen = !this.rightMenuOpen;
  }

  setTab(tab: ChartTabVariant) {
    this.chartTabVariant = tab;
  }

  setSeasonTab(tab: SeasonTabVariant) {
    this.seasonTabVariant = tab;
  }
}
