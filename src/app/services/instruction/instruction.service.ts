import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { checkList } from './instructions';

type Check = {
  checkId: number;
  value: number;
};

type CheckStore = Map<number, Check[]>;

@Injectable({
  providedIn: 'root',
})
export class InstructionService {
  private localStorageKey = 'cad-checklist';

  private checksStore = new BehaviorSubject<CheckStore>(
    this.loadFromLocalStorage(),
  );
  public checksStore$ = this.checksStore.asObservable();
  public checklist = checkList;

  constructor() {
    this.checksStore$.subscribe((store) => {
      this.saveToLocalStorage(store);
    });
  }

  public updateCheckList(activityId: number, checks: Check[]) {
    const checksList = this.checksStore.getValue();
    this.checksStore.next(checksList.set(activityId, checks));
  }

  private saveToLocalStorage(store: CheckStore) {
    const serializedStore = JSON.stringify(Array.from(store.entries()));
    localStorage.setItem(this.localStorageKey, serializedStore);
  }

  private loadFromLocalStorage(): CheckStore {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? new Map<number, Check[]>(JSON.parse(data)) : new Map();
  }
}
