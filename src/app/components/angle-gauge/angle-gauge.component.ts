import { Component, Input, OnChanges } from "@angular/core";
import { Color, NgxChartsModule } from "@swimlane/ngx-charts";

@Component({
  selector: "cad-angle-gauge",
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: "./angle-gauge.component.html",
  styleUrl: "./angle-gauge.component.scss",
})
export class AngleGaugeComponent implements OnChanges {
  @Input({ required: true }) data = { name: "", value: 0, color: "" };
  @Input({ required: true }) title = "Angular Gauge";

  min = 0;
  max = 180;
  results = [{ name: "", value: 0, color: "" }];
  colorScheme = {} as Color;

  ngOnChanges(): void {
    this.colorScheme = { domain: [this.data.color] } as Color;
    this.results = [
      {
        ...this.data,
        value: Math.min(Math.round(this.data.value), this.max),
      },
    ];
  }

}
