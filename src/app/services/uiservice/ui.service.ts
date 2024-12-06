import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private drawerOpen = new BehaviorSubject<boolean>(false);
  private modalOpen = new BehaviorSubject<boolean>(false);
  private tabGroups = new Map<string, BehaviorSubject<string>>();

  drawerOpen$ = this.drawerOpen.asObservable();
  modalOpen$ = this.modalOpen.asObservable();

  // Methods to control the drawer
  openDrawer() {
    this.drawerOpen.next(true);
    this.closeModal();
  }

  closeDrawer() {
    this.drawerOpen.next(false);
  }

  toggleDrawer() {
    this.drawerOpen.next(!this.drawerOpen.value);
    this.closeModal();
  }

  // Methods to control the modal
  openModal() {
    this.modalOpen.next(true);
    this.closeDrawer();
  }

  closeModal() {
    this.modalOpen.next(false);
  }

  toggleModal() {
    this.modalOpen.next(!this.modalOpen.value);
    this.closeDrawer();
  }

  // Methods to control the tabs
  getActiveTabId$(groupId: string) {
    if (!this.tabGroups.has(groupId)) {
      this.tabGroups.set(groupId, new BehaviorSubject<string>(''));
    }
    return this.tabGroups.get(groupId)?.asObservable();
  }

  setActiveTab(groupId: string, tabId: string) {
    if (!this.tabGroups.has(groupId)) {
      this.tabGroups.set(groupId, new BehaviorSubject<string>(''));
    }
    this.tabGroups.get(groupId)?.next(tabId);
  }

  initializeGroup(groupId: string, initialTabId: string) {
    if (!this.tabGroups.has(groupId)) {
      this.tabGroups.set(groupId, new BehaviorSubject<string>(initialTabId));
    }
  }
}
