import { CommonModule } from "@angular/common";
import { Component, type OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import {
  type Color,
  LegendPosition,
  LineChartComponent,
  NgxChartsModule,
} from "@swimlane/ngx-charts";
import { LapDto } from "./models";
import { data } from "./services/data.interface";
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
  results = data;
  view = [800, 400] as [number, number];
  legend = true;
  legendPosition = LegendPosition.Below;
  colorScheme = {} as Color;
  textValue = "";
  errorMessage = "";
  laps: LineChartComponent["results"] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.colorScheme = colorScheme;
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
    const firstSession = skaterData?.latestActivity?.sessions?.[0] || {};

    const date = new Date(firstSession.dateTimeStart || "");
    this.title = Intl.DateTimeFormat("nl-NL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    const laps = firstSession.laps || [];

    this.laps = [
      {
        name: "Snelheid",
        series: laps.map((lap: LapDto) => ({
          name: lap.nr,
          value: lap.speed?.kph,
        })),
      },
      {
        name: "Rondetijd",
        series: laps.map((lap: LapDto) => ({
          name: lap.nr,
          value: this.durationToSeconds(lap.duration || "0:00"),
        })),
      },
    ];
  }

  durationToSeconds(duration: string): number {
    // Regular expression to match "minutes:seconds.milliseconds" or "seconds.milliseconds"
    const regex = /^(\d+):(\d{1,2})\.(\d{1,3})$|^(\d+)\.(\d{1,3})$/;
    const match = duration.match(regex);

    if (!match) {
      throw new Error("Invalid duration format");
    }

    if (match[1]) {
      // Case with minutes and seconds (e.g., "1:10.360")
      const minutes = Number.parseInt(match[1], 10);
      const seconds = Number.parseInt(match[2], 10);
      const milliseconds = Number.parseInt(match[3], 10);

      return minutes * 60 + seconds + milliseconds / 1000;
    }
    if (match[4]) {
      // Case with only seconds and milliseconds (e.g., "10.360")
      const seconds = Number.parseInt(match[4], 10);
      const milliseconds = Number.parseInt(match[5], 10);

      return seconds + milliseconds / 1000;
    }
    throw new Error("Unexpected error in parsing");
  }
}
