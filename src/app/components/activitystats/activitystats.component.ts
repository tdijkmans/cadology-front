import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { SkateActvitity } from '../../services/data.interface';

@Component({
  selector: 'activitystats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activitystats.component.html',
  styleUrl: './activitystats.component.scss'
})
export class ActivitystatsComponent {

  @Input({ required: true }) currentActivity = {} as SkateActvitity[number];

}
