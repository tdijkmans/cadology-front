import { Component, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { type Color, LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import type { Data } from './services/data.interface';
import { DataService } from './services/data.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DataService]

})
export class AppComponent implements OnInit {
  title = 'cadology-front';
  results = [] as Data;
  view = [500, 400] as [number, number];
  legend = true;
  legendPosition = LegendPosition.Below;
  colorScheme = {} as Color;

  constructor(private dataService: DataService) { }



  ngOnInit() {
    const styles = getComputedStyle(document.documentElement);
    this.colorScheme = {
      domain:
        [styles.getPropertyValue('--data-color-primary'),
        styles.getPropertyValue('--data-color-secondary'),
        styles.getPropertyValue('--data-color-tertiary'),
        styles.getPropertyValue('--data-color-quaternary'),
        styles.getPropertyValue('--data-color-quinary'),
        styles.getPropertyValue('--data-color-senary')]
    } as Color

    this.dataService.getData().subscribe((data: Data) => {
      this.results = data;
    });
  }
}
