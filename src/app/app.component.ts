import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppMenuComponent } from '@components/app-menu/app-menu.component';
import { DrawerComponent } from '@components/drawer/drawer.component';
import { provideIcons } from '@ng-icons/core';
import {
  letsArrowLeft,
  letsArrowRight,
  letsCalendar,
  letsMenu,
} from '@ng-icons/lets-icons/regular';
import { DataService } from '@services/dataservice/data.service';
import { UiService } from '@services/uiservice/ui.service';
import { ModalComponent } from './components/modal/modal.component';

@Component({
  selector: 'cad-root',
  standalone: true,
  imports: [
    AppMenuComponent,
    RouterOutlet,
    CommonModule,
    DrawerComponent,
    FormsModule,
    ModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  viewProviders: [
    provideIcons({ letsArrowRight, letsArrowLeft, letsMenu, letsCalendar }),
  ],
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  constructor(
    public ui: UiService,
    private d: DataService,
  ) {}

  ngOnInit() {
    this.initApp();
  }

  initApp() {
    this.d.init().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
