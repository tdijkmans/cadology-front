import { CommonModule } from "@angular/common";
import { Component, type OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgApexchartsModule } from "ng-apexcharts";
import { tap } from "rxjs";
import { ActivitystatsComponent } from "./components/activitystats/activitystats.component";
import { LapchartsComponent } from "./components/lapchart/lapchart.component";
import { SpeedchartComponent } from "./components/speedchart/speedchart.component";
import type { SkateActvitity } from "./services/data.interface";
import { DataService } from "./services/data.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgApexchartsModule,
    LapchartsComponent,
    ActivitystatsComponent,
    SpeedchartComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],
})
export class AppComponent implements OnInit {
  title = "";
  chipInput = "";
  errorMessage = "";

  constructor(private dataService: DataService) { }

  ngOnInit() {
    const chipCode = this.dataService.getItem<string>("chipCode");

    if (chipCode) {
      this.chipInput = chipCode;
      this.fetchAllActivities(chipCode);
    } else {
      this.errorMessage = "Vul een chipcode in";
      this.dataService.removeItem("chipCode");
    }
  }

  get allActivities$() {
    return this.dataService.allActivities$;
  }

  get currentActivity$() {
    return this.dataService.currentActivity$.pipe(
      tap((res) => {
        console.log("Current Activity", res);
      })
    );
  }

  fetchAllActivities(chipCode: string) {
    this.dataService.getAllActivities({ chipCode }).subscribe((res) => {
      this.dataService.setCurrentActivity(res[0]);
      this.dataService.setAllActivities(res);
    });
  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      return;
    }
    this.errorMessage = "";
    this.fetchAllActivities(chipCode);
    this.dataService.setItem("chipCode", chipCode);
  }


  handleAct(activity: SkateActvitity) {
    this.dataService.setCurrentActivity(activity);
  }

  nextActivity() {
    console.log("Next Activity__");
    this.dataService.goToNextActivity();
  }

  prevActivity() {
    console.log("Previous Activity__");
    this.dataService.goToPreviousActivity();
  }


}
