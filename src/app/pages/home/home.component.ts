import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import type { Tab } from '@components/index';
import {
  ActivitystatsComponent,
  CardComponent,
  ChecklistComponent,
  CheckliststatsComponent,
  CombochartComponent,
  DistchartComponent,
  DistchartSeasonComponent,
  HistochartComponent,
  NotesComponent,
  PageComponent,
  TabComponent,
  TabsComponent,
} from '@components/index';
import { DataService, UiService } from '@services/index';

@Component({
  selector: 'cad-home',
  imports: [
    CommonModule,
    ActivitystatsComponent,
    HistochartComponent,
    DistchartComponent,
    DistchartSeasonComponent,
    PageComponent,
    NotesComponent,
    TabsComponent,
    TabComponent,
    CardComponent,
    ChecklistComponent,
    CheckliststatsComponent,
    CombochartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tabs: Tab[] = [
    { id: 'lapTime', icon: 'letsClock' },
    { id: 'speed', icon: 'letsSpeed' },
    { id: 'distance', icon: 'letsRoadAlt' },
    { id: 'myNotes', icon: 'letsNotebook' },
  ] as const;

  tabsTwo: Tab[] = [
    { id: 'season', icon: 'letsStat' },
    { id: 'distSeason', icon: 'letsRoadAlt' },
    { id: 'allChecks', icon: 'letsNotebook' },
  ] as const;

  constructor(
    public d: DataService,
    public ui: UiService,
  ) {}
}
