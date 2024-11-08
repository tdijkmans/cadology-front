import { CommonModule } from "@angular/common";
import { Component, type OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgApexchartsModule } from "ng-apexcharts";
import { ActivitystatsComponent } from "./components/activitystats/activitystats.component";
import { LapchartsComponent } from "./components/lapchart/lapchart.component";
import { SpeedchartComponent } from "./components/speedchart/speedchart.component";
import type { SkateActvitity } from "./services/data.interface";
import { DataService, } from "./services/data.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgApexchartsModule,
    LapchartsComponent,
    ActivitystatsComponent,
    SpeedchartComponent
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],
})
export class AppComponent implements OnInit {
  title = "";
  chipInput = "";
  errorMessage = "";
  currentActivity = {} as SkateActvitity[number];

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

  fetchAllActivities(chipCode: string) {
    this.dataService.getAllActivities({ chipCode }).subscribe((res) => {
      this.selectActivity(res[0]);
    });
  }

  selectActivity(actvity: SkateActvitity[number]) {
    this.currentActivity = actvity
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

}
