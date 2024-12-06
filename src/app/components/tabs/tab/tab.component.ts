import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TabsService } from '../service/tabs.service';

@Component({
  selector: 'cad-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  @Input({ required: true }) tabId = '';
  @Input({ required: true }) groupId = '';

  constructor(public t: TabsService) {}
}
