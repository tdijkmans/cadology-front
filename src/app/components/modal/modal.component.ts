import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivitieslistComponent } from '@components/activitieslist/activitieslist.component';
import { TabComponent } from '@components/tabs/tab/tab.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  letsArrowLeft,
  letsArrowRight,
  letsCalendar,
  letsClock,
  letsLightningAlt,
  letsRoadAlt,
  letsSortDown,
  letsSortUp,
  letsTrophy,
} from '@ng-icons/lets-icons/regular';
import { theme } from '@root/_variables';
import { Activity, DataService, UiService } from '@services/index';
import { BehaviorSubject, combineLatest, map, startWith, take } from 'rxjs';

type SortBy = 'startTime' | 'lapCount' | 'speed';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'cad-modal',
  imports: [
    CommonModule,
    ActivitieslistComponent,
    TabsComponent,
    TabComponent,
    NgIconComponent,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  viewProviders: [
    provideIcons({
      letsArrowRight,
      letsArrowLeft,
      letsTrophy,
      letsSortUp,
      letsSortDown,
      letsLightningAlt,
      letsCalendar,
      letsClock,
      letsRoadAlt,
    }),
  ],
})
export class ModalComponent implements OnInit {
  public tabs = [] as TabsComponent['tabs'];
  public sortOptions: { label: string; value: SortBy }[] = [
    { label: 'Datum', value: 'startTime' },
    { label: 'Aantal ronden', value: 'lapCount' },
    { label: 'Snelheid', value: 'speed' },
  ] as const;

  private sortStatus = new BehaviorSubject<{
    sortBy: SortBy;
    sortDirection: SortDirection;
  }>({ sortBy: 'startTime', sortDirection: 'desc' });

  sortStatus$ = this.sortStatus.asObservable();
  sortedActivities$;
  theme = theme;

  constructor(
    public ui: UiService,
    public d: DataService,
  ) {
    this.sortedActivities$ = combineLatest([
      this.d.currentData$.pipe(
        startWith({ curActivities: [], prevActivities: [] }),
      ),
      this.sortStatus$,
    ]).pipe(
      map(([data, sort]) => ({
        current: this.sortActivities(
          sort.sortBy,
          sort.sortDirection,
          data.curActivities,
        ),
        previous: this.sortActivities(
          sort.sortBy,
          sort.sortDirection,
          data.prevActivities,
        ),
      })),
    );
  }

  public stopPropagation(event: Event) {
    event.stopPropagation();
  }

  ngOnInit() {
    this.d.currentData$.pipe(take(1)).subscribe((d) => {
      this.tabs = [
        { label: 'Dit seizoen', value: d.curActivities.length, id: 'current' },
        {
          label: 'Vorig seizoen',
          value: d.prevActivities.length,
          id: 'previous',
        },
      ];
    });
  }

  public toggleSort(sortBy: SortBy) {
    this.sortStatus.next({
      sortBy,
      sortDirection:
        this.sortStatus.value.sortDirection === 'asc' ? 'desc' : 'asc',
    });
  }

  private sortActivities(
    sortBy: SortBy,
    sortDirection: SortDirection,
    activities: Activity[],
  ): Activity[] {
    return activities.sort((a, b) => {
      switch (sortBy) {
        case 'startTime':
          return sortDirection === 'asc'
            ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            : new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'lapCount':
          return sortDirection === 'asc'
            ? a.lapCount - b.lapCount
            : b.lapCount - a.lapCount;
        case 'speed':
          return sortDirection === 'asc'
            ? a.bestLap.speed - b.bestLap.speed
            : b.bestLap.speed - a.bestLap.speed;
      }
    });
  }
}
