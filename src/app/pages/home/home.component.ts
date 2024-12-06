import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivitystatsComponent } from '@components/activitystats/activitystats.component';
import { BarchartComponent } from '@components/barchart/barchart.component';
import { DistchartComponent } from '@components/distchart/distchart.component';
import { HistochartComponent } from '@components/histochart/histochart.component';
import { NotesComponent } from '@components/notes/notes.component';
import { PageComponent } from '@components/page/page.component';
import { TabComponent } from '@components/tabs/tab/tab.component';
import { Tab, TabsComponent } from '@components/tabs/tabs.component';
import { DataService } from '@services/dataservice/data.service';
import { CardComponent } from '../../components/card/card.component';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private destroyRef = inject(DestroyRef);
  title = '';
  chipInput = '';
  isLoading = true;

  tabs: Tab[] = [
    { id: 'lapTime', icon: 'letsClock' },
    { id: 'speed', icon: 'letsSpeed' },
    { id: 'distance', icon: 'letsRoadAlt' },
    { id: 'season', icon: 'letsStat' },
    { id: 'myNotes', icon: 'letsNotebook' },
  ];

  constructor(public d: DataService) {
    this.d.currentData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}
