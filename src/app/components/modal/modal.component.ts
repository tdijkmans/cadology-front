import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UiService } from '@services/uiservice/ui.service';

@Component({
  selector: 'cad-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  chipInput = '';
  errorMessage = '';

  constructor(public ui: UiService) {}

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
