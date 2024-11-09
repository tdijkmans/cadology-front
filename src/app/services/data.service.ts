import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, of, tap } from "rxjs";
import { environment } from "../../environments/environment";
import type { SkateActvitities, SkateActvitity } from "./data.interface";


@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient) { }

  private activity = new BehaviorSubject<SkateActvitity | null>(null);
  private activities = new BehaviorSubject<SkateActvitities | null>(null);

  get currentActivity$() {
    return this.activity.asObservable()
  }

  get allActivities$() {
    return this.activities.asObservable()
  }

  setCurrentActivity(activity: SkateActvitity) {
    this.activity.next(activity);

  }

  setAllActivities(activities: SkateActvitity[]) {
    this.activities.next(activities);
  }


  goToNextActivity() {
    this.allActivities$.subscribe((activities) => {
      if (!activities) {
        return;
      }
      const currentActivity = this.activity.value;
      if (!currentActivity) {
        return;
      }
      const currentIndex = activities.findIndex((activity) => activity.id === currentActivity.id);

      const prevIndex = currentIndex <= 0 ? activities.length - 1 : currentIndex - 1;
      const nextActivity = activities[prevIndex];
      console.log('nextActivity', { nextActivity, currentIndex, nextIndex: prevIndex });
      this.setCurrentActivity(nextActivity);
    });


  }

  goToPreviousActivity() {
    this.allActivities$.subscribe((activities) => {
      if (!activities) {
        return;
      }
      const currentActivity = this.activity.value;
      if (!currentActivity) {
        return;
      }
      const currentIndex = activities.findIndex((activity) => activity.id === currentActivity.id);

      const nextIndex = currentIndex >= activities.length - 1 ? 0 : currentIndex + 1;
      const nextActivity = activities[nextIndex];
      console.log('nextActivity', { nextActivity, currentIndex, nextIndex });
      this.setCurrentActivity(nextActivity);
    });

  }


  getAllActivities({ chipCode }: { chipCode: string }) {
    const cacheKey = `SkateActvitity-${chipCode}`;
    const cachedData = this.getItem<SkateActvitities>(cacheKey);

    if (cachedData) {
      this.setAllActivities(cachedData);
      return of(cachedData);
    }

    const url = `${environment.apiUrl}/skater/${chipCode}/all`;
    return this.http.get<SkateActvitities>(url).pipe(
      tap((res) => {
        this.setAllActivities(res);
        this.setItem(cacheKey, res);
      })
    )
  }



  // LocalStorage methods

  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage item with key "${key}":`, error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(`Error getting localStorage item with key "${key}":`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item with key "${key}":`, error);

    }
  }
}
