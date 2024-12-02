import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
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
export class NotesComponent implements OnChanges {
  @Input({ required: true }) currentActivity: Activity | null = null;

  notes: string[] = [];
  note = '';

  constructor() { }

  ngOnChanges() {
    this.initializeData();
  }

  initializeData() {
    console.log('initializeData', { currentActivity: this.currentActivity });
  }

  addNote() {
    console.log('addNote');
    this.notes.push(this.note);
  }

}
