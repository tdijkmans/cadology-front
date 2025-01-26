import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiService } from '@services/index';

@Component({
  selector: 'cad-tab',
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  @Input({ required: true }) tabId = '';
  @Input({ required: true }) groupId = '';

  constructor(public t: UiService) {}
}
