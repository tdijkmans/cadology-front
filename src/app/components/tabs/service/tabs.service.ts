import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private tabGroups = new Map<string, BehaviorSubject<string>>();

  public getActiveTabId$(groupId: string) {
    if (!this.tabGroups.has(groupId)) {
      this.tabGroups.set(groupId, new BehaviorSubject<string>(''));
    }
    return this.tabGroups.get(groupId)!.asObservable();
  }

  public setActiveTab(groupId: string, tabId: string) {
    if (!this.tabGroups.has(groupId)) {
      this.tabGroups.set(groupId, new BehaviorSubject<string>(''));
    }
    this.tabGroups.get(groupId)!.next(tabId);
  }

  public initializeGroup(groupId: string, initialTabId: string) {
    if (!this.tabGroups.has(groupId)) {
      this.tabGroups.set(groupId, new BehaviorSubject<string>(initialTabId));
    }
  }
}
