import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  letsAddRing,
  letsCloseSquare,
  letsPen,
} from '@ng-icons/lets-icons/regular';
import type { Activity } from '@services/dataservice/data.interface';

@Component({
  selector: 'cad-notes',
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
  viewProviders: [provideIcons({ letsAddRing, letsPen, letsCloseSquare })],
})
export class NotesComponent implements OnInit {
  @Input({ required: true }) currentActivity: Activity | null = null;

  notes: string[] = [];
  note = '';

  public ngOnInit() {
    const notes = localStorage.getItem('notes');
    if (notes) {
      this.notes = JSON.parse(notes);
    }
  }

  public addNote() {
    this.notes.push(this.note);
    this.note = '';
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  public removeNote(note: string) {
    this.notes = this.notes.filter((n) => note !== n);
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
}
