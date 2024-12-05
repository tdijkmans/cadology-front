import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tab } from '../tabs.component';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  private activeTabId = new BehaviorSubject<Tab['id']>('');

  public activeTabId$ = this.activeTabId.asObservable();

  public setActiveTab(tabId: Tab['id']) {
    this.activeTabId.next(tabId);
  }
}
