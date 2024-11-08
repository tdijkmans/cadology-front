import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { type ApexOptions, NgApexchartsModule } from "ng-apexcharts";
import type { LapDto, SessionDto } from "../../models";
import { DataService } from "../../services/data.service";
import { durationToSeconds } from "../utilities";

const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue("--data-color-primary");
const secondaryColor = styles.getPropertyValue("--data-color-secondary");
const twoDecimal = (v: number) => Math.round(v * 100) / 100;

@Component({
  selector: 'speedchart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './speedchart.component.html',
  styleUrl: './speedchart.component.scss'
})
export class SpeedchartComponent {
  @Input({ required: true }) sessions: SessionDto[] = [];
  @Input({ required: true }) yAxisMinMax: [number, number] = [20, 100];

  speedChartOptions: Partial<ApexOptions> = {} as ApexOptions;

  constructor(private dataService: DataService) { }

  ngOnChanges() {
    this.setChartOptions(this.sessions);
  }

  setChartOptions(sessions: SessionDto[]) {
    const laps = sessions.flatMap((session) => session.laps || []);


    const lapDurations = laps
      .map((lap: LapDto) =>
        durationToSeconds(lap.duration || "0:00"),
      )
      .map((v) => twoDecimal(v));

    const lapSpeeds = laps
      .map((lap) => lap.speed?.kph || 0)
      .map((v) => twoDecimal(v));

    const categories = lapDurations.map((v, i) => i + 1);

    const overwriteCategories = categories.map((v, i) =>
      i === 0 || i % 5 === 0 || i === lapDurations.length - 1 ? `${v}` : "",
    );

    const commonOptions: Partial<ApexOptions> = {
      plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
        },
      },
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      xaxis: { categories, overwriteCategories },
    } as const;

    const tooltip = {
      enabled: true,
      fixed: {
        enabled: true,
        position: "topRight",
        offsetY: 100,
        offsetX: -20,
      },
      style: {
        fontSize: "1rem",
        fontFamily: "Roboto, sans-serif",
      },

      x: {
        show: true,
        formatter: (v: number) => `Ronde ${v}`,
      },
    } as const;


    this.speedChartOptions = {
      ...commonOptions,
      tooltip: {
        ...tooltip,
        y: {
          formatter: (v: number) => `${v} km/h`,
        },
      },
      series: [
        {
          name: "Sneldheid",
          type: "column",
          data: lapSpeeds,
          color: secondaryColor,
        },
      ],
      yaxis: [
        {
          seriesName: "Snelheid",
          axisTicks: { show: true },
          axisBorder: { show: true, color: secondaryColor },
          min: this.yAxisMinMax[0],
          max: this.yAxisMinMax[1],
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
    };
  }



}
