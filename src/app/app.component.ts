import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { AppMenuComponent } from "@components/app-menu/app-menu.component";
import { DataService } from "@services/dataservice/data.service";
import { combineLatest, distinctUntilChanged, map, of } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AppMenuComponent, RouterOutlet, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [DataService],

})
export class AppComponent {
  private destroyRef = inject(DestroyRef);

  chipInput = "";

  constructor(
    private d: DataService,
    private r: ActivatedRoute,
  ) { }

  ngOnInit() {
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

      });
  }

}
