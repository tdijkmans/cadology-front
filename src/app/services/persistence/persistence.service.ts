import { Injectable } from '@angular/core';

type CacheKey = 'chipCode' | 'CurrentSeason' | 'PreviousSeason' | 'journalLog';

export interface LogEntry {
  activityId: number;
  timestamp: number;
  checkList: {
    id: number;
    name: string;
    value: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  public logActivity(logEntry: LogEntry): void {
    const currentLog = this.getItem<LogEntry[]>('journalLog') || [];

    const existingLogEntry = currentLog.find(
      (entry) => entry.activityId === logEntry.activityId,
    );

    if (existingLogEntry) {
      currentLog[currentLog.indexOf(existingLogEntry)] = logEntry;
    } else {
      currentLog.push(logEntry);
    }

    this.setItem('journalLog', currentLog);

    console.log('Activity logged:', logEntry);
  }

  public getJournalLogEntry(activityId: number): LogEntry | null {
    const log = this.getItem<LogEntry[]>('journalLog') || [];
    return log.find((entry) => entry.activityId === activityId) || null;
  }

  public getChipCode() {
    return this.getItem<string>('chipCode');
  }

  public setItem<T>(
    key: CacheKey,
    value: T,
    expirationMin: '15min' | '1year' = '15min',
  ): void {
    // Convert expiration time from minutes to milliseconds (default: 15 minutes)
    const expiration =
      expirationMin === '1year' ? 365 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000;

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

  public getItem<T>(key: CacheKey): T | null {
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

  public clearLocalStorage(): void {
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
}
