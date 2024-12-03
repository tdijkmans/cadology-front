import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivitystatsComponent } from "@components/activitystats/activitystats.component";
import { BarchartComponent } from "@components/barchart/barchart.component";
import { DistchartComponent } from "@components/distchart/distchart.component";
import { HistochartComponent } from "@components/histochart/histochart.component";
import { NotesComponent } from "@components/notes/notes.component";
import { PageComponent } from "@components/page/page.component";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  letsClock,
  letsNotebook,
  letsRoadAlt,
  letsSpeed,
  letsStat,
} from "@ng-icons/lets-icons/regular";
import { DataService } from "@services/dataservice/data.service";
import { BehaviorSubject } from "rxjs";
import { DistchartSeasonComponent } from "../../components/distchart-season/distchart-season.component";
import type { ChartTabVariant, SeasonTabVariant } from "./home.interface";

@Component({
  selector: "cad-home",
  standalone: true,
  imports: [
    CommonModule,
    ActivitystatsComponent,
    BarchartComponent,
    HistochartComponent,
    DistchartComponent,
    DistchartSeasonComponent,
    NgIconComponent,
    PageComponent,
    NotesComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  viewProviders: [
    provideIcons({
      letsClock,
      letsSpeed,
      letsRoadAlt,
      letsStat,
      letsNotebook,
    }),
  ],
})
export class HomeComponent {
  private destroyRef = inject(DestroyRef);
  title = "";
  chipInput = "";
  isLoading = true;

  chartTab = new BehaviorSubject<ChartTabVariant>("distance");
  seasonTab = new BehaviorSubject<SeasonTabVariant>("progress");

  constructor(public d: DataService) {
    this.d.currentData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isLoading = false;
      });
  }


  setTab(tab: ChartTabVariant) {
    this.chartTab.next(tab);
  }

  setSeasonTab(tab: SeasonTabVariant) {
    this.seasonTab.next(tab);
  }
}
