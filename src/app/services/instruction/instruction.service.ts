import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { checkList } from './instructions';

@Injectable({
  providedIn: 'root',
})
export class InstructionService {
  private localStorageKey = 'cad-checklist';

  private checksStore = new BehaviorSubject<Map<number, number[]>>(
    this.loadFromLocalStorage(),
  );
  public checksStore$ = this.checksStore.asObservable();
  public checklist = checkList;

  constructor() {
    this.checksStore$.subscribe((store) => {
      this.saveToLocalStorage(store);
    });
  }

  public updateCheckList(activityId: number, checks: number[]) {
    const checksList = this.checksStore.getValue();
    this.checksStore.next(checksList.set(activityId, checks));
  }

  private saveToLocalStorage(store: Map<number, number[]>) {
    const serializedStore = JSON.stringify(Array.from(store.entries()));
    localStorage.setItem(this.localStorageKey, serializedStore);
  }

  private loadFromLocalStorage(): Map<number, number[]> {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? new Map<number, number[]>(JSON.parse(data)) : new Map();
  }
}
