import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'cad-circle-badge',
  imports: [CommonModule],
  templateUrl: './circle-badge.component.html',
  styleUrl: './circle-badge.component.scss',
})
export class CircleBadgeComponent {
  @Input({ required: true }) count = 0;
  @Input() active = false;
}
