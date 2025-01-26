import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CircleBadgeComponent } from '@components/circle-badge/circle-badge.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  letsChartAlt,
  letsClock,
  letsNotebook,
  letsPen,
  letsRoadAlt,
  letsSpeed,
  letsStat,
} from '@ng-icons/lets-icons/regular';
import { UiService } from '@services/index';
import { Tab } from './tabs.inteface';

@Component({
  selector: 'cad-tabs',
  imports: [CommonModule, CircleBadgeComponent, NgIconComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  viewProviders: [
    provideIcons({
      letsClock,
      letsSpeed,
      letsRoadAlt,
      letsStat,
      letsNotebook,
      letsChartAlt,
      letsPen,
    }),
  ],
})
export class TabsComponent implements OnInit {
  @Input({ required: true }) tabs: Tab[] = [];
  @Input({ required: true }) groupId!: string;

  constructor(public ui: UiService) {}

  setSelectedTab(tabId: Tab['id']) {
    this.ui.setActiveTab(this.groupId, tabId);
  }

  ngOnInit() {
    if (this.tabs.length) {
      this.ui.initializeGroup(this.groupId, this.tabs[0].id);
    }
  }
}
