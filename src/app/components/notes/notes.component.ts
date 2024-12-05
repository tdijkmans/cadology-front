import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { letsAddRing, letsNotebook } from '@ng-icons/lets-icons/regular';
import { Activity } from '@services/dataservice/data.interface';

@Component({
  selector: 'cad-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
  viewProviders: [provideIcons({ letsAddRing, letsNotebook })],
})
export class NotesComponent {
  @Input({ required: true }) currentActivity: Activity | null = null;

  notes: string[] = [];
  note = '';

  addNote() {
    this.notes.push(this.note);
  }
}
