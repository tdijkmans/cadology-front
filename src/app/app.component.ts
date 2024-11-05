import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { type Color, LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';

const results = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  },
  {
    "name": "UK",
    "value": 5200000
  },
  {
    "name": "Italy",
    "value": 7700000
  },
  {
    "name": "Spain",
    "value": 4300000
  }
]

type Data = typeof results

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxChartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'cadology-front';

  results = results;
  view = [500, 400] as [number, number];
  legend = true;
  legendPosition = LegendPosition.Below;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  } as Color

  constructor() {
    Object.assign(this, { results });
  }

  onSelect(data: Data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: Data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: Data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
