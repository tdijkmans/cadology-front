import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { Activity } from '@services/dataservice/data.interface';
import { DataService } from '@services/dataservice/data.service';
import {
  CheckListItem,
  InstructionService,
} from '@services/instruction/instruction.service';
import {
  LogEntry,
  PersistenceService,
} from '@services/persistence/persistence.service';
import { combineLatest, tap } from 'rxjs';
import { ChartheaderComponent } from '../chart/chartheader/chartheader.component';

@Component({
  selector: 'cad-checklist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartheaderComponent,
    NgIconComponent,
  ],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss',
})
export class ChecklistComponent implements OnInit {
  @Input({ required: true }) currentActivity: Activity | null = null;
  private destroyRef = inject(DestroyRef);

  form: FormGroup<{ checkList: FormArray<FormControl<number>> }>;

  constructor(
    public i: InstructionService,
    public d: DataService,
    private p: PersistenceService,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      checkList: this.formBuilder.array([
        new FormControl(0) as FormControl<number>,
      ]),
    });

    // this.d.currentActivity$.pipe(takeUntilDestroyed(this.destroyRef), tap(
    //   (activity) => { (this.currentActivity = activity) }
    // )).subscribe();
  }

  ngOnInit(): void {
    // Initialize form when data changes
    combineLatest([this.i.checklist$, this.d.currentActivity$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(([checklist, activity]) => {
          this.updateCheckList(checklist, activity.activityId);
        }),
      )
      .subscribe();

    // Log form and data changes
    combineLatest([this.i.checklist$, this.form.valueChanges])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(([checklist, formValue]) => {
          const logEntry = this.createLogEntry(checklist, formValue);
          if (logEntry) {
            console.log(logEntry);
            this.p.logActivity(logEntry);
          }
        }),
      )
      .subscribe();
  }

  get checkList(): FormArray<FormControl<number>> {
    return this.form.get('checkList') as FormArray;
  }

  private updateCheckList(data: CheckListItem[], activityId?: number) {
    if (!activityId) {
      console.error('Activity ID not found');
      return;
    }

    const existingLogEntry = this.p.getJournalLogEntry(activityId);
    if (!existingLogEntry) {
      console.warn(`No journal log entry found for activityId: ${activityId}`);
    }

    const existingCheckList = existingLogEntry?.checkList ?? [];
    const formArray = this.checkList;
    formArray.clear(); // Clear existing controls

    for (const item of data) {
      const matchingEntry = existingCheckList.find(
        (entry) => entry.id === item.id,
      );
      const value = matchingEntry?.value;
      const control = new FormControl(value) as FormControl<number>;
      formArray.push(control);
    }
  }

  submit() {
    console.log(this.form.value);
  }

  private createLogEntry(
    checklist: CheckListItem[],
    formValue: typeof this.form.value,
  ): LogEntry | null {
    const activity = {
      activityId: this.currentActivity?.activityId,
      startTime: this.currentActivity?.startTime,
      location: this.currentActivity?.location,
    };

    if (!activity.activityId || !formValue.checkList) {
      console.error('Activity ID or form value not found for logging');
      return null;
    }

    // Ensure indices match between checklist and formValue.checkList
    if (formValue.checkList.length !== checklist.length) {
      console.error('Mismatch between checklist and form values');
      return null;
    }

    const checkList = formValue.checkList.map((value, index) => ({
      value,
      id: checklist[index].id,
      name: checklist[index].name,
    }));

    return {
      activityId: activity.activityId,
      timestamp: Date.now(),
      checkList,
    };
  }
}
