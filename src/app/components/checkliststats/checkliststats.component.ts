import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/dataservice/data.service';
import { InstructionService } from '@services/instruction/instruction.service';
import { UiService } from '@services/uiservice/ui.service';

@Component({
  selector: 'cad-checkliststats',
  standalone: true,
  imports: [],
  templateUrl: './checkliststats.component.html',
  styleUrl: './checkliststats.component.scss',
})
export class CheckliststatsComponent implements OnInit {
  constructor(
    public d: DataService,
    public ui: UiService,
    public i: InstructionService,
  ) {}

  ngOnInit(): void {
    this.i.checkStatistics$.subscribe((stats) => {});
  }
}
