import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InstructionService } from '@services/index';

@Component({
  selector: 'cad-checkliststats',
  imports: [CommonModule],
  templateUrl: './checkliststats.component.html',
  styleUrl: './checkliststats.component.scss',
})
export class CheckliststatsComponent {
  constructor(public i: InstructionService) {}
}
