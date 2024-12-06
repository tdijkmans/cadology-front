import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  letsAddRing,
  letsCloseSquare,
  letsNotebook,
} from '@ng-icons/lets-icons/regular';
import { Activity } from '@services/dataservice/data.interface';

@Component({
  selector: 'cad-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
  viewProviders: [provideIcons({ letsAddRing, letsNotebook, letsCloseSquare })],
})
export class NotesComponent implements OnInit {
  @Input({ required: true }) currentActivity: Activity | null = null;

  notes: string[] = [];
  note = '';

  ngOnInit() {
    const notes = localStorage.getItem('notes');
    if (notes) {
      this.notes = JSON.parse(notes);
    }
  }

  addNote() {
    this.notes.push(this.note);
    this.note = '';
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  removeNote(note: string) {
    this.notes = this.notes.filter((n) => note !== n);
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
}
