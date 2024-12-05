import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CircleBadgeComponent } from '@components/circle-badge/circle-badge.component';
import { TabsService } from './service/tabs.service';

export type Tab = { label: string; value: number; id: string };

@Component({
  selector: 'cad-tabs',
  standalone: true,
  imports: [CommonModule, CircleBadgeComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit {
  @Input({ required: true }) tabs: Tab[] = [];

  constructor(public t: TabsService) {}

  setSelectedTab(tabId: Tab['id']) {
    this.t.setActiveTab(tabId);
  }

  ngOnInit() {
    this.t.setActiveTab(this.tabs[0].id);
  }
}
