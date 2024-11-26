import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  letsArrowLeft,
  letsArrowRight,
  letsSettingLine,
} from "@ng-icons/lets-icons/regular";
import { DataService } from "@services/dataservice/data.service";

@Component({
  selector: "app-menu",
  standalone: true,
  providers: [DataService],
  viewProviders: [
    provideIcons({ letsArrowRight, letsArrowLeft, letsSettingLine }),
  ],
  imports: [FormsModule, CommonModule, NgIconComponent],
  templateUrl: "./app-menu.component.html",
  styleUrl: "./app-menu.component.scss",
})
export class AppMenuComponent {
  private destroyRef = inject(DestroyRef);
  chipInput = "";
  errorMessage = "";
  menuOpen = false;


  constructor(private d: DataService) {
    this.chipInput = this.d.getItem<string>("chipCode") || "";
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  clearCache() {
    this.d.clearLocalStorage();
  }

  onClick(chipCode: string) {
    if (!chipCode) {
      this.errorMessage = "Vul een chipcode in";
      return;
    }
    this.errorMessage = "";
    // Initialize with the chipCode from the form
    this.d
      .init(chipCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
