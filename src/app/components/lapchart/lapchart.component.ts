import { CommonModule } from "@angular/common";
import { Component, Input, type OnChanges } from "@angular/core";
import { type ApexOptions, NgApexchartsModule } from "ng-apexcharts";
import type { LapDto, SessionDto } from "../../models";
import { durationToSeconds } from "../utilities";

const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue("--data-color-primary");
const secondaryColor = styles.getPropertyValue("--data-color-secondary");
const twoDecimal = (v: number) => Math.round(v * 100) / 100;

@Component({
  selector: "lapchart",
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: "./lapchart.component.html",
  styleUrl: "./lapchart.component.scss",
})
export class LapchartsComponent implements OnChanges {
  @Input({ required: true }) sessions: SessionDto[] = [];
  @Input({ required: true }) yAxisMinMax: [number, number] = [20, 100];

  lapChartOptions: Partial<ApexOptions> = {} as ApexOptions;


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

    this.lapChartOptions = {
      ...commonOptions,
      tooltip: {
        ...tooltip,
        y: {
          formatter: (v: number) => `${v} sec`,
        },
      },
      series: [
        {
          name: "Rondetijd",
          type: "column",
          data: lapDurations,
          color: primaryColor,
        },
      ],
      yaxis: [
        {
          axisTicks: { show: true },
          axisBorder: { show: true, color: primaryColor },
          min: this.yAxisMinMax[0],
          max: this.yAxisMinMax[1],
          labels: {
            style: { colors: primaryColor },
          },
          decimalsInFloat: 0,
          title: {
            text: "Rondetijd (sec)",

            style: {
              fontWeight: 400,
              fontSize: "1rem",
              fontFamily: "Roboto, sans-serif",
              cssClass: "xx-apexcharts-yaxis-title",
            },
          },
        },
      ],
    };

  }
}
