import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import type { BehaviorSubject } from "rxjs";

@Component({
  selector: "cad-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./page.component.html",
  styleUrl: "./page.component.scss",
})
export class PageComponent {
  @Input({ required: true }) isLoading$: BehaviorSubject<boolean> | null = null;


}
