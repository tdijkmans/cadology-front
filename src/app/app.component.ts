import { CommonModule } from "@angular/common";
import { Component, type OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import {
  type Color,
  NgxChartsModule
} from "@swimlane/ngx-charts";
import type { LapDto } from "./models";
import { DataService, type SkaterData } from "./services/data.service";

const styles = getComputedStyle(document.documentElement);
const colorScheme = {
  domain: [
    styles.getPropertyValue("--data-color-primary"),
    styles.getPropertyValue("--data-color-secondary"),
    styles.getPropertyValue("--data-color-tertiary"),
    styles.getPropertyValue("--data-color-quaternary"),
    styles.getPropertyValue("--data-color-quinary"),
    styles.getPropertyValue("--data-color-senary"),
  ],
} as Color;

const colorSchemeTwo = { domain: [colorScheme.domain[1]], } as Color;

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NgxChartsModule, FormsModule, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],
})
export class AppComponent implements OnInit {
  title = "";
  view = [800, 400] as [number, number];
  colorScheme = {} as Color;
  colorSchemeTwo = {} as Color;
  textValue = "";
  errorMessage = "";
  lapColumns: { name: number; value: number }[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.colorScheme = colorScheme;
    this.colorSchemeTwo = colorSchemeTwo;
    const chipCode = localStorage.getItem("chipCode");
    if (chipCode) {
      this.fetchLaps(chipCode);
      this.textValue = chipCode;
    }
  }

  onClick(chipCode?: string) {
    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      return;
    }
    this.fetchLaps(chipCode);
    localStorage.setItem("chipCode", chipCode);
  }

  fetchLaps(chipCode: string) {
    this.dataService.getData({ chipCode }).subscribe((res: SkaterData) => {
      this.processData(res);
    });
  }

  processData(skaterData?: SkaterData) {
    const sessions = skaterData?.latestActivity?.sessions || [];
    const date = new Date(sessions[0].dateTimeStart || "");

    this.title = Intl.DateTimeFormat("nl-NL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    const laps = sessions.flatMap((session) => session.laps || []);
    console.log(laps);


    this.lapColumns = laps.map((lap: LapDto, i) => ({
      name: i + 1,
      value: this.dataService.durationToSeconds(lap.duration || "0:00"),
    }))
  }

}
