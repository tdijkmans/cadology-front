import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, tap } from "rxjs";
import { environment } from "../../environments/environment";
import type { SkateActvitity } from "./data.interface";


@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient) { }


  getAllActivities({ chipCode }: { chipCode: string }) {
    const cacheKey = `SkateActvitity-${chipCode}`;
    const cachedData = this.getItem<SkateActvitity>(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    const url = `${environment.apiUrl}/skater/${chipCode}/all`;
    return this.http.get<SkateActvitity>(url).pipe(
      tap((res) => {
        this.setItem(cacheKey, res);
      })
    );
  }

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
