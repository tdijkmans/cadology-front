import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, mergeMap, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import type { Activity, SeasonsResponse } from "./data.interface";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient) { }

  private activity = new BehaviorSubject<Activity | null>(null);
  private activities = new BehaviorSubject<Activity[] | null>(null);

  get currentActivity$() {
    return this.activity.asObservable();
  }

  get allActivities$() {
    return this.activities.asObservable();
  }

  setCurrentActivity(activity: Activity) {
    this.activity.next(activity);
  }

  private setAllActivities(activities: Activity[]) {
    this.activities.next(activities);
  }

  navigateActivity(direction: "next" | "previous") {
    return this.allActivities$.pipe(
      tap((activities) => {
        const currentActivity = this.activity.value;

        if (!activities || !currentActivity) return;

        const currentIndex = activities.findIndex(
          (activity) => activity.activityId === currentActivity.activityId,
        );

        const newIndex =
          direction === "previous"
            ? (currentIndex + 1) % activities.length
            : (currentIndex - 1 + activities.length) % activities.length;

        const newActivity = activities[newIndex];

        this.setCurrentActivity(newActivity);
      }),
    );
  }

  init = (chipCode: string) => {
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
          }),
        );
      }),
    );
  };

  fetchCurrentSeasonActivities({ chipCode }: { chipCode: string }) {
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

  fetchPreviousSeasonActivities({ chipCode }: { chipCode: string }) {
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

  setItem<T>(key: string, value: T, expirationMin = 15): void {
    // Convert expiration time from minutes to milliseconds (default: 15 minutes)
    const expiration = expirationMin * 60 * 1000;

    if (key === "chipCode") {
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

      if (key === "chipCode") {
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

  removeItem(key: string): void {
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
      const chipCode = localStorage.getItem("chipCode");
      localStorage.clear();
      if (chipCode) {
        localStorage.setItem("chipCode", chipCode);
      }
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}
