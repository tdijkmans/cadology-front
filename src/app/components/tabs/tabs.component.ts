import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CircleBadgeComponent } from '@components/circle-badge/circle-badge.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  letsClock,
  letsNotebook,
  letsRoadAlt,
  letsSpeed,
  letsStat,
} from '@ng-icons/lets-icons/regular';
import { TabsService } from './service/tabs.service';

type Icon =
  | 'letsClock'
  | 'letsSpeed'
  | 'letsRoadAlt'
  | 'letsStat'
  | 'letsNotebook';

export type Tab = { label?: string; value?: number; id: string; icon?: Icon };

@Component({
  selector: 'cad-tabs',
  standalone: true,
  imports: [CommonModule, CircleBadgeComponent, NgIconComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  viewProviders: [
    provideIcons({ letsClock, letsSpeed, letsRoadAlt, letsStat, letsNotebook }),
  ],
})
export class TabsComponent implements OnInit {
  @Input({ required: true }) tabs: Tab[] = [];
  @Input({ required: true }) groupId!: string;

  constructor(public t: TabsService) {}

  setSelectedTab(tabId: Tab['id']) {
    this.t.setActiveTab(this.groupId, tabId);
    console.log('setSelectedTab', tabId, this.groupId);
  }

  ngOnInit() {
    if (this.tabs.length) {
      this.t.initializeGroup(this.groupId, this.tabs[0].id);
    }
  }
}
