import { CommonModule } from "@angular/common";
import { Component, DestroyRef, type OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
import { BehaviorSubject, type Observable, combineLatest, distinctUntilChanged, map, of } from "rxjs";
import type { ChartTabVariant, SeasonTabVariant } from "./app.interface";
import { DistchartComponent } from "./components/distchart/distchart.component";
import { DistchartSeasonComponent } from "./distchart-season/distchart-season.component";
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
    DistchartSeasonComponent
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
  menuOpen = false;

  chartTab = new BehaviorSubject<ChartTabVariant>("distance");
  seasonTab = new BehaviorSubject<SeasonTabVariant>("current");

  currentData$: Observable<{
    currentActivity: Activity; currentSeasonActivities: Activity[]; previousSeasonActivities: Activity[];
  }>

  constructor(
    private d: DataService,
    private r: ActivatedRoute,
    private url: Router,
  ) {


    this.currentData$ = combineLatest([
      this.d.currentActivity$,
      this.d.currentSeasonActivities$,
      this.d.previousSeasonActivities$
    ]).pipe(
      map(([currentActivity, currentSeasonActivities, previousSeasonActivities]) => ({
        currentActivity,
        currentSeasonActivities,
        previousSeasonActivities
      }))
    );

  }

  ngOnInit() {
    this.handleChipInput();

  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      return;
    }
    this.errorMessage = "";
    this.d.setItem("chipCode", chipCode);
    this.handleChipInput();
  }

  handleChipInput() {
    const localChipCode$ = of(this.d.getItem<string>("chipCode"));
    const routeChipCode$ = this.r.queryParams.pipe<string>(map((params) => params["transponder"]));

    combineLatest([routeChipCode$, localChipCode$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged()
      )
      .subscribe(([routeChipCode, localChipCode]) => {
        const chipCode = routeChipCode || localChipCode;
        if (!chipCode) { return; }

        // Initialize with the chipCode
        this.d.init(chipCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

        // Update local storage and chip input
        this.d.setItem("chipCode", chipCode);
        this.chipInput = chipCode;

        // Update query params if necessary
        if (!routeChipCode) {
          console.log("Navigating to", chipCode);
          this.url.navigate([], {
            relativeTo: this.r,
            queryParams: { transponder: chipCode },
            queryParamsHandling: "merge",
          });
        }
      });
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



  toggleRightMenu() {
    this.menuOpen = !this.menuOpen;
  }

  setTab(tab: ChartTabVariant) {
    this.chartTab.next(tab);
  }

  setSeasonTab(tab: SeasonTabVariant) {
    this.seasonTab.next(tab);
  }
}
