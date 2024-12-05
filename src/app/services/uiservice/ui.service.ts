import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private drawerOpen = new BehaviorSubject<boolean>(false);
  private modalOpen = new BehaviorSubject<boolean>(false);

  drawerOpen$ = this.drawerOpen.asObservable(); // Observable for drawer state
  modalOpen$ = this.modalOpen.asObservable(); // Observable for modal state

  // Methods to control the drawer
  openDrawer() {
    this.drawerOpen.next(true);
  }

  closeDrawer() {
    this.drawerOpen.next(false);
  }

  toggleDrawer() {
    this.drawerOpen.next(!this.drawerOpen.value);
  }

  // Methods to control the modal
  openModal() {
    this.modalOpen.next(true);
  }

  closeModal() {
    this.modalOpen.next(false);
  }

  toggleModal() {
    this.modalOpen.next(!this.modalOpen.value);
  }
}
