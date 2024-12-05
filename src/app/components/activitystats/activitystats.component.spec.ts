import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitystatsComponent } from './activitystats.component';

describe('ActivitystatsComponent', () => {
  let component: ActivitystatsComponent;
  let fixture: ComponentFixture<ActivitystatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitystatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitystatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
