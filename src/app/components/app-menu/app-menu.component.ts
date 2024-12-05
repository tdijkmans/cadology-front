import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { UiService } from '@services/uiservice/ui.service';

@Component({
  selector: 'cad-menu',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIconComponent,
    CommonModule,
    NgIconComponent,
  ],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.scss',
})
export class AppMenuComponent {
  constructor(public ui: UiService) {}
}
