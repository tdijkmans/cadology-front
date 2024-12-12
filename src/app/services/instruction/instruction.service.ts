import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Check, CheckStore } from './instruction.interface';
import { checkList } from './instructions';

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

  public checkStatistics$ = this.checksStore$.pipe(
    map((store) => this.getCheckStatistics(store)),
  );

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

  public getCheckStatistics(store: CheckStore) {
    const checks = Array.from(store.values())
      .flat()
      .filter((check) => check.value > 0);

    const averageScorePerCheckId = checks.reduce(
      (acc, check) => {
        acc[check.checkId] = (acc[check.checkId] || 0) + check.value;
        return acc;
      },
      {} as Record<number, number>,
    );

    const checkCountPerCheckId = checks.reduce(
      (acc, check) => {
        acc[check.checkId] = (acc[check.checkId] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const averageScorePerCheckIdNormalized = Object.entries(
      averageScorePerCheckId,
    ).reduce(
      (acc, item) => {
        const [checkIdSt, score] = item;
        const checkId = Number(checkIdSt);
        const instructionName = this.checklist.find(
          (check) => check.checkId === checkId,
        )?.name;
        const normalizedScore = score / checkCountPerCheckId[checkId];

        acc[checkId] = normalizedScore;
        return acc;
      },
      {} as Record<string, number>,
    );

    return averageScorePerCheckIdNormalized;
  }
}
