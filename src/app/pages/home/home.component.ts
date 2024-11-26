import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivitieslistComponent } from "@components/activitieslist/activitieslist.component";
import { ActivitystatsComponent } from "@components/activitystats/activitystats.component";
import { BarchartComponent } from "@components/barchart/barchart.component";
import { CircleBadgeComponent } from "@components/circle-badge/circle-badge.component";
import { DistchartComponent } from "@components/distchart/distchart.component";
import { HistochartComponent } from "@components/histochart/histochart.component";
import type { Activity } from "@services/dataservice/data.interface";
import { DataService } from "@services/dataservice/data.service";
import { BehaviorSubject, type Observable, combineLatest, map } from "rxjs";
import { DistchartSeasonComponent } from "../../components/distchart-season/distchart-season.component";
import type { ChartTabVariant, SeasonTabVariant } from "./home.interface";

@Component({
  selector: 'cad-home',
  standalone: true,
  imports: [
    CommonModule,
    ActivitystatsComponent,
    ActivitieslistComponent,
    CircleBadgeComponent,
    BarchartComponent,
    HistochartComponent,
    DistchartComponent,
    DistchartSeasonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private destroyRef = inject(DestroyRef);
  title = "";
  chipInput = "";

  chartTab = new BehaviorSubject<ChartTabVariant>("distance");
  seasonTab = new BehaviorSubject<SeasonTabVariant>("current");

  currentData$: Observable<{
    currentActivity: Activity;
    curActivities: Activity[];
    prevActivities: Activity[];
  }>;

  constructor(
    private d: DataService,
  ) {
    this.currentData$ = combineLatest([
      this.d.currentActivity$,
      this.d.curActivities$,
      this.d.prevActivities$,
    ]).pipe(
      map(([currentActivity, curActivities, prevActivities]) => ({
        currentActivity,
        curActivities,
        prevActivities,
      })),
    );
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

  setTab(tab: ChartTabVariant) {
    this.chartTab.next(tab);
  }

  setSeasonTab(tab: SeasonTabVariant) {
    this.seasonTab.next(tab);
  }
}
