import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersistenceService } from '@services/persistence/persistence.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  distinctUntilChanged,
  map,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Activity, Data, SeasonsResponse, Status } from './data.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  private chipCode = new BehaviorSubject<string | null>(null);

  private data = new BehaviorSubject<Data>({
    currentActivity: {} as Activity,
    activities: [],
  });

  private data$ = this.data.asObservable();

  private status = new BehaviorSubject<Status>('loading');

  public chipCode$ = this.chipCode.asObservable();

  constructor(
    private http: HttpClient,
    private p: PersistenceService,
  ) {}

  public status$ = this.status.asObservable();

  public currentActivity$ = this.data.asObservable().pipe(
    map(({ currentActivity: activity }) => activity),
    distinctUntilChanged(),
  );

  public currentData$ = this.data.pipe(
    mergeMap((data) => of(data.activities)),
    map((activities) => {
      const currentActivity = this.data.value.currentActivity;
      const curActivities = activities.filter(
        (a) => a.season === 'currentSeasonActivities',
      );
      const prevActivities = activities.filter(
        (a) => a.season === 'previousSeasonActivities',
      );

      return { currentActivity, curActivities, prevActivities };
    }),
  );

  public setChipCode(chipCode: string) {
    this.p.setItem('chipCode', chipCode);
    this.chipCode.next(chipCode);
    return this.chipCode$ as Observable<string>;
  }

  public setCurrentActivity(activity: Activity) {
    if (!activity) {
      console.error('No activity provided');
      return;
    }
    this.data.next({
      currentActivity: activity,
      activities: this.data.value.activities,
    });
  }

  private setAllActivities(activities: Activity[]) {
    this.data.next({
      currentActivity: this.data.value.currentActivity,
      activities,
    });
  }

  public navigateActivity(direction: 'next' | 'previous') {
    return this.data$.pipe(
      map((data) => data.activities),
      distinctUntilChanged(),
      tap((activities) => {
        const currentActivity = this.data.value.currentActivity;

        if (!activities || !currentActivity) {
          console.error('No activities or current activity found');
          return;
        }

        const currentIndex = activities.findIndex(
          (activity) => activity.activityId === currentActivity.activityId,
        );

        const newIndex =
          direction === 'previous'
            ? (currentIndex + 1) % activities.length
            : (currentIndex - 1 + activities.length) % activities.length;

        const newActivity = activities[newIndex];

        if (!newActivity) {
          console.error('No activity found');
          return;
        }

        this.setCurrentActivity(newActivity);
      }),
    );
  }

  public init = (chipCode?: string) => {
    this.status.next('loading');

    const localChipCode = this.p.getChipCode();
    const chipCodeToUse = chipCode || localChipCode;

    if (!chipCodeToUse) {
      this.status.next('error');
      throw new Error('No chipCode provided');
    }

    return this.setChipCode(chipCodeToUse).pipe(
      mergeMap(() =>
        this.fetchCurrentSeasonActivities({ chipCode: chipCodeToUse }),
      ),
      mergeMap((currentActivities) => {
        const currentData = currentActivities.data ?? [];
        this.setCurrentActivity(currentData[0]);
        this.setAllActivities(currentData);

        return this.fetchPreviousSeasonActivities({
          chipCode: chipCodeToUse,
        }).pipe(
          map((previousActivities) => {
            const previousData = previousActivities.data ?? [];
            const allActivities = [...currentData, ...previousData];

            // Sort by startTime, falling back to default ordering
            const sortedActivities = allActivities.sort((a, b) => {
              return (
                (new Date(b?.startTime).getTime() || 0) -
                (new Date(a?.startTime).getTime() || 0)
              );
            });

            this.setAllActivities(sortedActivities);
            return sortedActivities;
          }),
        );
      }),
      tap(() => this.status.next('loaded')),
      catchError((err) => {
        console.error('Error initializing activities:', err);
        this.status.next('error');
        return throwError(() => new Error('Initialization failed'));
      }),
    );
  };

  private fetchCurrentSeasonActivities({ chipCode }: { chipCode: string }) {
    const cacheKey = 'CurrentSeason';
    const cachedData = this.p.getItem<SeasonsResponse>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    const url = `${environment.apiUrl}/current/${chipCode}`;
    return this.http.get<SeasonsResponse>(url).pipe(
      tap((res) => {
        this.p.setItem(cacheKey, res);
      }),
      catchError(() => of({ data: [] })),
    );
  }

  private fetchPreviousSeasonActivities({ chipCode }: { chipCode: string }) {
    const cacheKey = 'PreviousSeason';
    const cachedData = this.p.getItem<SeasonsResponse>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    const url = `${environment.apiUrl}/previous/${chipCode}`;
    return this.http.get<SeasonsResponse>(url).pipe(
      tap((res) => {
        this.p.setItem(cacheKey, res, '1year');
      }),
      catchError(() => of({ data: [] })),
    );
  }
}
