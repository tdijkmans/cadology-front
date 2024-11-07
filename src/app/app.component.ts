import { CommonModule } from "@angular/common";
import { Component, type OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import {
  type ApexOptions,
  type ChartComponent,
  NgApexchartsModule,
} from "ng-apexcharts";
import type { LapDto } from "./models";
import { DataService, type SkaterData } from "./services/data.service";

const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue("--data-color-primary");
const secondaryColor = styles.getPropertyValue("--data-color-secondary");

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, NgApexchartsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],
})
export class AppComponent implements OnInit {
  title = "";
  textValue = "";
  errorMessage = "";

  @ViewChild("chart") chart: ChartComponent = {} as ChartComponent;

  chartOptions: Partial<ApexOptions> = {} as ApexOptions;

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
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
    this.setChartOptions(laps);
  }

  setChartOptions(laps: LapDto[]) {
    const twoDecimal = (v: number) => Math.round(v * 100) / 100;

    const lapDurations = laps
      .map((lap: LapDto) =>
        this.dataService.durationToSeconds(lap.duration || "0:00"),
      )
      .map((v) => twoDecimal(v));

    const lapSpeeds = laps
      .map((lap) => lap.speed?.kph || 0)
      .map((v) => twoDecimal(v));

    const categories = lapDurations
      .map((v, i) => i + 1)
      .map((v, i) =>
        i === 0 || i % 5 === 0 || i === lapDurations.length - 1 ? v : "",
      );

    this.chartOptions = {
      plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
        },
      },
      series: [
        {
          name: "Rondetijd",
          type: "column",
          data: lapDurations,
          color: primaryColor,
        },
        {
          name: "Sneldheid",
          type: "column",
          data: lapSpeeds,
          color: secondaryColor,
        },
      ],
      chart: { type: "bar", toolbar: { show: false } },
      dataLabels: { enabled: false },
      xaxis: { categories },

      yaxis: [
        {
          axisTicks: { show: true },
          axisBorder: { show: true, color: primaryColor },
          labels: {
            style: {
              colors: primaryColor,
            },
          },
          decimalsInFloat: 0,
          title: {
            text: "Rondetijd (sec)",
            style: {
              fontWeight: 400,
              fontSize: "1rem",
              fontFamily: "Roboto, sans-serif",
            },
          },
        },
        {
          seriesName: "Snelheid",
          opposite: true,
          axisTicks: { show: true },
          axisBorder: { show: true, color: secondaryColor },
          labels: {
            style: {
              colors: secondaryColor,
            },
          },
          decimalsInFloat: 0,
          title: {
            text: "Sneldheid (km/h)",
            style: {
              fontWeight: 400,
              fontSize: "1rem",
              fontFamily: "Roboto, sans-serif",
            },
          },
        },
      ],

      legend: {
        horizontalAlign: "left",
        offsetX: 40,
      },
    };
  }
}
