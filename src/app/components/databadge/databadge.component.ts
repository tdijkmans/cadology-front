import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsTrophy } from '@ng-icons/lets-icons/regular';

@Component({
  selector: 'cad-databadge',
  imports: [CommonModule, NgIconComponent],
  templateUrl: './databadge.component.html',
  styleUrl: './databadge.component.scss',
  viewProviders: [provideIcons({ letsTrophy })],
})
export class DatabadgeComponent {
  @Input({ required: true }) hasTrophy = false;
  @Input({ required: true }) value: null | string | number = null;
  @Input({ required: true }) isCurrent = false;
  @Input({ required: true }) unit: 'km/u' | 'sec' | 'ronden' = 'km/u';

  @Input() percentage = 0;
}
