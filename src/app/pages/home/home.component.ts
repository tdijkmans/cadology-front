import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivitystatsComponent } from '@components/activitystats/activitystats.component';
import { BarchartComponent } from '@components/barchart/barchart.component';
import { CheckliststatsComponent } from '@components/checkliststats/checkliststats.component';
import { DistchartComponent } from '@components/distchart/distchart.component';
import { HistochartComponent } from '@components/histochart/histochart.component';
import { NotesComponent } from '@components/notes/notes.component';
import { PageComponent } from '@components/page/page.component';
import { TabComponent } from '@components/tabs/tab/tab.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { Tab } from '@components/tabs/tabs.inteface';
import { DataService } from '@services/dataservice/data.service';
import { UiService } from '@services/uiservice/ui.service';
import { CardComponent } from '../../components/card/card.component';
import { ChecklistComponent } from '../../components/checklist/checklist.component';
import { DistchartSeasonComponent } from '../../components/distchart-season/distchart-season.component';

@Component({
  selector: 'cad-home',
  standalone: true,
  imports: [
    CommonModule,
    ActivitystatsComponent,
    BarchartComponent,
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  tabs: Tab[] = [
    { id: 'myNotes', icon: 'letsNotebook' },
    { id: 'lapTime', icon: 'letsClock' },
    { id: 'speed', icon: 'letsSpeed' },
    { id: 'distance', icon: 'letsRoadAlt' },
  ] as const;

  tabsTwo: Tab[] = [
    { id: 'allChecks', icon: 'letsNotebook' },
    { id: 'season', icon: 'letsStat' },
    { id: 'distSeason', icon: 'letsChartAlt' },
  ] as const;

  constructor(
    public d: DataService,
    public ui: UiService,
  ) {}
}
