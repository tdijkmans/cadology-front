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
import { InstructionService } from '@services/instruction/instruction.service';
import { CheckListItem } from '@services/instruction/instructions';
import { combineLatest, filter, tap } from 'rxjs';
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

  formGroup: FormGroup<{ myChecklist: FormArray<FormControl<number>> }>;
  checklist: CheckListItem[] = [];

  constructor(
    public d: DataService,
    public i: InstructionService,
    private formBuilder: FormBuilder,
  ) {
    const formControls = i.checklist.map(
      () => new FormControl(0, { nonNullable: true }),
    );
    const form = this.formBuilder.array(formControls);
    const formGroup = this.formBuilder.group({ myChecklist: form });
    this.formGroup = formGroup;
    this.checklist = i.checklist;
  }

  get form() {
    return this.formGroup.get('myChecklist') as FormArray<FormControl<number>>;
  }

  ngOnInit(): void {
    combineLatest([this.d.currentActivity$, this.i.checksStore$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(([activity]) => !!activity.activityId),
        tap(([activity, checksStore]) => {
          const checks = checksStore.get(activity.activityId);
          if (checks) {
            this.form.setValue(checks.map((check) => check.value));
          } else {
            this.form.reset();
          }
        }),
      )
      .subscribe();
  }

  handleRatingChange(
    checkId: number,
    newValue: number,
    activityId: Activity['activityId'],
  ) {
    this.i.updateCheckList(activityId, { checkId, value: newValue });
  }
}
