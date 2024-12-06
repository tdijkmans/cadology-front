import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Activity, Data, SeasonsResponse } from './data.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  private chipCode = new BehaviorSubject<string | null>(null);

  private data = new BehaviorSubject<Data>({
    currentActivity: {} as Activity,
    activities: [],
  });

  private data$ = this.data.asObservable();

  private status = new BehaviorSubject<'loading' | 'loaded' | 'error'>(
    'loading',
  );

  public chipCode$ = this.chipCode.asObservable();

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
    this.chipCode.next(chipCode);
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

  public init = (chipCode: string) => {
    this.status.next('loading');
    this.setItem('chipCode', chipCode);
    this.setChipCode(chipCode);

    return this.fetchCurrentSeasonActivities({ chipCode }).pipe(
      mergeMap((currentActivities) => {
        this.setCurrentActivity(currentActivities.data[0]);
        this.setAllActivities(currentActivities.data);
        return this.fetchPreviousSeasonActivities({ chipCode }).pipe(
          tap((previousActivities) => {
            // Combine current and previous activities
            const allActivities = [
              ...currentActivities.data,
              ...(previousActivities.data ?? []),
            ];
            const sortedActivities = allActivities.sort((a, b) => {
              if (a?.startTime && b?.startTime) {
                return (
                  new Date(b.startTime).getTime() -
                  new Date(a.startTime).getTime()
                );
              }
              return 0;
            });

            this.setAllActivities(sortedActivities);
            this.status.next('loaded');
          }),
        );
      }),
    );
  };

  private fetchCurrentSeasonActivities({ chipCode }: { chipCode: string }) {
    const cacheKey = `SkateActvitity-CurrentSeason-${chipCode}`;
    const cachedData = this.getItem<SeasonsResponse>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    const url = `${environment.apiUrl}/current/${chipCode}`;
    return this.http.get<SeasonsResponse>(url).pipe(
      tap((res) => {
        this.setItem(cacheKey, res);
      }),
      catchError(() => of({ data: [] })),
    );
  }

  private fetchPreviousSeasonActivities({ chipCode }: { chipCode: string }) {
    const cacheKey = `SkateActvitity-PreviousSeason-${chipCode}`;
    const cachedData = this.getItem<SeasonsResponse>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    const url = `${environment.apiUrl}/previous/${chipCode}`;
    return this.http.get<SeasonsResponse>(url).pipe(
      tap((res) => {
        this.setItem(cacheKey, res, 60 * 24 * 7 * 365); // 1 year
      }),
      catchError(() => of({ data: [] })),
    );
  }

  // LocalStorage methods

  private setItem<T>(key: string, value: T, expirationMin = 15): void {
    // Convert expiration time from minutes to milliseconds (default: 15 minutes)
    const expiration = expirationMin * 60 * 1000;

    if (key === 'chipCode') {
      // Store chipCode without expiration
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      const expirationDate = Date.now() + expiration;
      const dataWithExpiration = { value, expiration: expirationDate };
      try {
        localStorage.setItem(key, JSON.stringify(dataWithExpiration));
      } catch (error) {
        console.error(
          `Error setting localStorage item with key "${key}":`,
          error,
        );
      }
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      if (!serializedValue) return null;

      if (key === 'chipCode') {
        // Return chipCode without checking expiration
        return JSON.parse(serializedValue);
      }

      const dataWithExpiration = JSON.parse(serializedValue);
      if (
        dataWithExpiration.expiration &&
        Date.now() > dataWithExpiration.expiration
      ) {
        // If expired, remove the item and return null
        this.removeItem(key);
        return null;
      }

      return dataWithExpiration.value as T;
    } catch (error) {
      console.error(
        `Error getting localStorage item with key "${key}":`,
        error,
      );
      return null;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Error removing localStorage item with key "${key}":`,
        error,
      );
    }
  }

  clearLocalStorage(): void {
    try {
      const chipCode = localStorage.getItem('chipCode');
      localStorage.clear();
      if (chipCode) {
        localStorage.setItem('chipCode', chipCode);
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
