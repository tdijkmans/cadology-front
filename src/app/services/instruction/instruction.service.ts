import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Check, CheckId, CheckStore } from './instruction.interface';
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

  public updateCheckList(activityId: number, newCheck: Check) {
    const checksList = this.checksStore.getValue();
    const checksToInit = this.checklist.map(({ checkId }) => ({
      checkId,
      value: 0,
    }));
    const currentChecks = checksList.get(activityId) || checksToInit;

    const checkIndex = currentChecks.findIndex(
      (check) => check.checkId === newCheck.checkId,
    );
    if (checkIndex === -1) {
      currentChecks.push(newCheck);
    } else {
      currentChecks[checkIndex] = newCheck;
    }

    checksList.set(activityId, currentChecks);
    this.checksStore.next(checksList);
  }

  private saveToLocalStorage(store: CheckStore) {
    const serializedStore = JSON.stringify(Array.from(store.entries()));
    localStorage.setItem(this.localStorageKey, serializedStore);
  }

  private loadFromLocalStorage(): CheckStore {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? new Map<number, Check[]>(JSON.parse(data)) : new Map();
  }

  public getCheckStatistics(store: CheckStore, filterZeroes = true) {
    const allChecks = Array.from(store.values())
      .flat()
      .filter((check) => check.value > 0);
    const filteredChecks = allChecks.filter((check) => check.value > 0);
    const checks = filterZeroes ? filteredChecks : allChecks;

    const averageScorePerCheckId = checks.reduce(
      (acc, check) => {
        acc[check.checkId] = (acc[check.checkId] || 0) + check.value;
        return acc;
      },
      {} as Record<CheckId, number>,
    );

    const checkCountPerCheckId = checks.reduce(
      (acc, check) => {
        acc[check.checkId] = (acc[check.checkId] || 0) + 1;
        return acc;
      },
      {} as Record<CheckId, number>,
    );

    const averageScorePerCheckIdNormalized = Object.entries(
      averageScorePerCheckId,
    ).reduce(
      (acc, item) => {
        const [checkIdSt, score] = item;
        const checkId = Number(checkIdSt);

        const normalizedScore = score / checkCountPerCheckId[checkId];

        acc[checkId] = normalizedScore;
        return acc;
      },
      {} as Record<CheckId, number>,
    );

    const stats = Object.entries(averageScorePerCheckIdNormalized).map(
      ([checkId, score]) => {
        const instructionName = this.checklist.find(
          (check) => check.checkId === Number(checkId),
        )?.name;
        const count = checkCountPerCheckId[Number(checkId)];
        return { instructionName, score, count, checkId: Number(checkId) };
      },
    );

    return stats.sort((a, b) => b.count - a.count);
  }
}
