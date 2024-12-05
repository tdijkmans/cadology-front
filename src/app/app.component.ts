import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AppMenuComponent } from '@components/app-menu/app-menu.component';
import { DataService } from '@services/dataservice/data.service';
import { Observable, combineLatest, distinctUntilChanged, map, of } from 'rxjs';

@Component({
  selector: 'cad-root',
  standalone: true,
  imports: [AppMenuComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  chipCode$: Observable<string | null> = of(null);

  constructor(
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
}
