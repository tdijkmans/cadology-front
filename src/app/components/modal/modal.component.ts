import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivitieslistComponent } from '@components/activitieslist/activitieslist.component';
import { TabComponent } from '@components/tabs/tab/tab.component';
import { DataService } from '@services/dataservice/data.service';
import { UiService } from '@services/uiservice/ui.service';
import { take } from 'rxjs';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'cad-modal',
  standalone: true,
  imports: [CommonModule, ActivitieslistComponent, TabsComponent, TabComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  tabs = [] as TabsComponent['tabs'];

  constructor(
    public ui: UiService,
    public d: DataService,
  ) {}

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  ngOnInit() {
    this.d.currentData$.pipe(take(1)).subscribe((d) => {
      this.tabs = [
        { label: 'Dit seizoen', value: d.curActivities.length, id: 'current' },
        {
          label: 'Vorig seizoen',
          value: d.prevActivities.length,
          id: 'previous',
        },
      ];
    });
  }
}
