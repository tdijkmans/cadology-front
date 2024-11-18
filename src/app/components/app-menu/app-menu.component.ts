import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import {
  letsArrowLeft,
  letsArrowRight,
  letsSettingLine,
} from "@ng-icons/lets-icons/regular";
import { DataService } from "@services/dataservice/data.service";
import { combineLatest, distinctUntilChanged, map, of } from "rxjs";

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

  constructor(
    private d: DataService,
    private r: ActivatedRoute,
    private url: Router,
  ) { }

  ngOnInit() {
    this.handleChipInput();
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
    this.d.setItem("chipCode", chipCode);
    this.handleChipInput();
  }

  handleChipInput() {
    const localChipCode$ = of(this.d.getItem<string>("chipCode"));
    const routeChipCode$ = this.r.queryParams.pipe<string>(
      map((params) => params["transponder"]),
    );

    combineLatest([routeChipCode$, localChipCode$])
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe(([routeChipCode, localChipCode]) => {
        const chipCode = routeChipCode || localChipCode;
        if (!chipCode) {
          return;
        }

        // Initialize with the chipCode
        this.d
          .init(chipCode)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();

        // Update local storage and chip input
        this.d.setItem("chipCode", chipCode);
        this.chipInput = chipCode;

        // Update query params if necessary
        if (!routeChipCode) {
          this.url.navigate([], {
            relativeTo: this.r,
            queryParams: { transponder: chipCode },
            queryParamsHandling: "merge",
          });
        }
      });
  }
}
