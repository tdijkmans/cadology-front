import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
import { Observable, combineLatest, distinctUntilChanged, map, of } from 'rxjs';
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
  chipCode$: Observable<string | null> = of(null);
  errorMessage = '';
  chipInput = '';

  constructor(
    public ui: UiService,
    private d: DataService,
    private r: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initApp();
  }

  initApp() {
    const localChipCode$ = of(this.d.getItem<string>('chipCode'));
    const routeChipCode$ = this.r.queryParams.pipe<string>(
      map((params) => params['transponder']),
    );

    combineLatest([routeChipCode$, localChipCode$])
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe(([routeChipCode, localChipCode]) => {
        const chipCode = routeChipCode || localChipCode;
        if (!chipCode) {
          return;
        }

        this.chipCode$ = of(chipCode);

        // Initialize with the chipCode
        this.d
          .init(chipCode)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      });
  }

  clearCache() {
    this.d.clearLocalStorage();
  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = 'Vul een chipcode in';
      return;
    }
    this.errorMessage = '';
    // Initialize with the chipCode from the form
    this.d.init(chipCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
