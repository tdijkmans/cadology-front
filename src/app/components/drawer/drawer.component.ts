import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsCloseSquare } from '@ng-icons/lets-icons/regular';
import { DataService } from '@services/dataservice/data.service';
import { PersistenceService } from '@services/persistence/persistence.service';
import { UiService } from '@services/uiservice/ui.service';

@Component({
  selector: 'cad-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  viewProviders: [provideIcons({ letsCloseSquare })],
})
export class DrawerComponent {
  private destroyRef = inject(DestroyRef);
  errorMessage = '';
  chipInput = '';

  constructor(
    public ui: UiService,
    private d: DataService,
    private p: PersistenceService,
  ) {
    this.d.chipCode$.subscribe((chipCode) => {
      this.chipInput = chipCode || '';
    });
  }

  clearCache() {
    this.p.clearLocalStorage();
  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = 'Vul een chipcode in';
      return;
    }
    this.errorMessage = '';
    // Initialize with the chipCode from the form
    this.d.init(chipCode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.ui.closeDrawer();
  }
}
